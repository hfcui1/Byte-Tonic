import { channelsData$ } from './channels/main';

channelsData$.subscribe(channelsData => {
  console.log(channelsData);
});
