import {FormControl} from '@angular/forms';

export class StatusValidator {

  static validStatus(fc: FormControl) {
    if (!(fc.value.toLowerCase() === 'true' || fc.value.toLowerCase() === 'false' )) {
      return ({
        unknownStatus: true,
      });
    } else {
      return null;
    }
  }
}
