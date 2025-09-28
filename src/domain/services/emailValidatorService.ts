import {Email} from "@domain/value-objects";

export class emailValidatorService {
    private allowedDomains: Set<string>;
    constructor() {
        this.allowedDomains = new Set(['corp.com', 'university.edu']);
    }

    isValid(email: Email) {

        // faites un choix
        // est ce que vous préférez ?
         const domain0 = email.getValue().split('@')[1];
         // ou bien
         const domain = email.getDomain();   // le calcul de la partie du DNS domain est fait dans la classe Email


        return this.allowedDomains.has(domain);
    }
}