import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Card, CardKey, Player, Results } from '../../interfaces/computer';


@Component({
  selector: 'app-computer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './computer.component.html',
  styleUrl: './computer.component.scss'
})
export class ComputerComponent {

  // Signals
  player = signal<Player>({ name: 'Você', score: 100, selected: false, choice: '', winner: false });
  opponent = signal<Player>({ name: 'Máquina', score: 100, selected: false, choice: '', winner: false });
  disablePlayer = signal(false);
  endGame = signal(false);

  message = signal('');
  results = signal<Results>({ player: null, opponent: null });
  roundNumber = signal(1);

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

  selectCard(key: CardKey) {
    if (this.endGame()) return;

    const p = { ...this.player() };
    p.choice = key;
    p.selected = true;
    this.player.set(p);

    // Máquina escolhe aleatoriamente
    const machineChoice = this.selection[Math.floor(Math.random() * this.selection.length)].key;
    const o = { ...this.opponent() };
    o.choice = machineChoice;
    o.selected = true;
    this.opponent.set(o);

    this.disablePlayer.set(true);
    this.message.set('Os dois escolheram');

    const round = this.roundNumber() - 1;
    this.results.set({
      player: this.selectIcons[p.choice],
      opponent: this.selectIcons[o.choice]
    });

    setTimeout(() => {
      this.calculateScore();
      this.results.set({ player: null, opponent: null });
      this.roundNumber.update(v => v + 1);
      this.player.update(pl => ({ ...pl, selected: false }));
      this.opponent.update(op => ({ ...op, selected: false }));
      this.disablePlayer.set(false);
    }, 2000);
  }

calculateScore() {
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

  const p = this.player().choice;
  const o = this.opponent().choice;

  if (!p || !o) return;

  if (p === o) {
    this.message.set('Empate!');
  } else if (rules[p].includes(o)) {
    const phrase = phrases[`${p}-${o}`];
    this.message.set(`Você venceu! ${phrase}`);
    this.opponent.update(op => ({ ...op, score: op.score - 10 }));
  } else {
    const phrase = phrases[`${o}-${p}`];
    this.message.set(`Máquina venceu! ${phrase}`);
    this.player.update(pl => ({ ...pl, score: pl.score - 10 }));
  }

  if (this.player().score <= 0 || this.opponent().score <= 0) {
    if (this.player().score === 0) {
      this.opponent.update(op => ({ ...op, winner: true }));
    } else {
      this.player.update(pl => ({ ...pl, winner: true }));
    }
    this.endGame.set(true);
    this.message.set('Fim de jogo');
  }
}

}
