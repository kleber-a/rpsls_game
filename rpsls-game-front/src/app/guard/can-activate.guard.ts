import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const canActivateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let playerData
  const playerDataString = sessionStorage.getItem('player');
  if (playerDataString !== null && playerDataString.trim() !== '') {
    playerData = JSON.parse(playerDataString);
  }
  if (!playerDataString || route.params['roomName'] !== playerData.roomName ) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
