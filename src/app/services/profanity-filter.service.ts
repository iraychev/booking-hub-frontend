import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfanityFilterService {
  private profanityList = [
    'ass', 'bastard', 'bitch', 'crap', 'damn', 'fuck', 'shit', 'whore',
    'cock', 'cunt', 'dick', 'dildo', 'dyke', 'fag', 'faggot', 'jizz',
    'nigger', 'piss', 'prick', 'pussy', 'scrotum', 'slut', 'twat', 'wank',
    'asshole', 'bollocks', 'bugger', 'bullshit', 'cocksucker',
    'dickhead', 'goddamn', 'motherfucker'
  ];

  hasProfanity(text: string): boolean {
    const lowerCaseText = text.toLowerCase();
    const profanityPattern = new RegExp(`\\b(${this.profanityList.join('|')})\\b`, 'i');
    return profanityPattern.test(lowerCaseText);
  }
}