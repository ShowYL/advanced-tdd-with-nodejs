import {AntiSpamPort} from "@domain/ports/anti-spam.port";


export class EmailWithoutSpan {
    private _antiSpamPort: AntiSpamPort;


    constructor(email: string, antiSpamPort: AntiSpamPort) {
        super(email.toLowerCase()  );
        this._antiSpamPort = antiSpamPort;
    }

    public async isValid(email: string): Promise< boolean> {
      throw new Error("Method not implemented.");
    }


}