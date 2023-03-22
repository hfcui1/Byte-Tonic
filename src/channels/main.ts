import { Subject, merge, of, switchMap } from 'rxjs';
import { channelData$ } from './juejin/main';

export const refreshChannelsDataNotifier$ = new Subject();

const init$ = of('');
export const channelsData$ = merge(init$, refreshChannelsDataNotifier$).pipe(
  switchMap(() => channelData$)
);
