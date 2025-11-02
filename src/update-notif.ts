import updateNotifier, { Package } from 'update-notifier';
// something is just really wrong with this import I guess
import pkg from '../package.json';

export const checkForUpdate = () => {
    const notifier = updateNotifier({ pkg });
    console.log('AJB: notifier: ', notifier);

    notifier.notify();
};
