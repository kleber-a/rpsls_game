import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {CardKey, Card, Player, Room, Results} from '../../interfaces/player';

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {

  #service = inject(ApiService);
  #route = inject(Router);

  room = signal<Room | null>(null);
  player = signal<Player>(this.initPlayer());
  opponent = signal<Player>(this.initPlayer());
  disablePlayer = signal(true);
  endGame = signal(false);

  message = signal('');
  results = signal<Results>({ player: null, opponent: null });

  selection: Card[] = [
    { key: 'rock', icon: '🗿', name: 'Pedra' },
    { key: 'paper', icon: '📄', name: 'Papel' },
    { key: 'scissors', icon: '✂️', name: 'Tesoura' },
    { key: 'lizard', icon: '🦎', name: 'Lagarto' },
    { key: 'spock', icon: '🖖', name: 'Spock' }
  ];

  private selectIcons: Record<CardKey, string> = {
    rock: '🗿',
    paper: '📄',
    scissors: '✂️',
    lizard: '🦎',
    spock: '🖖'
  };

  ngOnInit(): void {
    this.#service.onRoomUpdate().subscribe((res: Room) => {
      this.room.set(res);
      const players = res.players || [];
      const myIndex = players.findIndex((p: any) => p.socketId === this.#service.getSocketIdSignal()());
      const oppIndex = players.findIndex((p: any) => p.socketId !== this.#service.getSocketIdSignal()());

      this.player.set(players[myIndex] || this.initPlayer());
      this.opponent.set(players[oppIndex] || this.initPlayer());

      res.status !== 'finished' ? this.configPlayers() : this.finishGame();
    });
  }

  selectCard(key: CardKey) {
    this.#service.selectCard(this.room(), false, key);
  }

  configPlayers() {
    const p = this.player();
    const o = this.opponent();
    if (!o.name) {
      this.message.set('Esperando segundo player entrar');
      this.disablePlayer.set(true);
      return;
    }

    if (!p.selected) {
      this.message.set('Escolha sua carta');
      this.disablePlayer.set(false);
      return;
    }

    if (!o.selected) {
      this.message.set('Esperando segundo jogador escolher uma carta');
      this.disablePlayer.set(true);
      return;
    }

    this.disablePlayer.set(true);
    this.message.set('Os dois escolheram');
    const round = (this.room()?.roundNumber || 1) - 1;
    this.results().player = this.selectIcons[p.choice[round] as CardKey];
    this.results().opponent = this.selectIcons[o.choice[round] as CardKey];

    setTimeout(() => {
      this.#service.selectCard(this.room(), true);
      this.results().player = null;
      this.results().opponent = null;
    }, 3000);
  }

resultRound(): string {
  const rules: Record<CardKey, CardKey[]> = {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['spock', 'paper'],
    spock: ['scissors', 'rock']
  };

  const phrases: Record<string, string> = {
    'scissors-paper': 'Tesoura corta papel',
    'paper-rock': 'Papel cobre pedra',
    'rock-lizard': 'Pedra esmaga lagarto',
    'lizard-spock': 'Lagarto envenena Spock',
    'spock-scissors': 'Spock esmaga tesoura',
    'scissors-lizard': 'Tesoura decapita lagarto',
    'lizard-paper': 'Lagarto come papel',
    'paper-spock': 'Papel refuta Spock',
    'spock-rock': 'Spock vaporiza pedra',
    'rock-scissors': 'Pedra quebra tesoura'
  };

  const round = (this.room()?.roundNumber || 1) - 1;
  const p = this.player().choice[round] as CardKey | '';
  const o = this.opponent().choice[round] as CardKey | '';

  if (!p || !o) return 'Aguardando...';
  if (p === o) return 'Empate!';

  const key = `${p}-${o}`;
  const reverseKey = `${o}-${p}`;

  if (rules[p]?.includes(o)) {
    return `Você venceu! ${phrases[key]}`;
  }
  if (rules[o]?.includes(p)) {
    return `Seu oponente venceu! ${phrases[reverseKey]}`;
  }

  return 'Resultado indefinido';
}


  finishGame() {
    this.message.set('Fim de Jogo');
    this.endGame.set(true);
  }

  leaveRoom() {
    this.#route.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.#service.disconnect();
    sessionStorage.setItem('player', '')
  }

  private initPlayer(): Player {
    return { name: '', score: 100, selected: false, choice: '', winner: false, avatar: '👤' };
  }
}
