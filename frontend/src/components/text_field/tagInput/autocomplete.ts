import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';

interface AutocompleteOptions {
  suggestions: string[];
  inputValue: string;
  onSuggestionClick: (suggestion: string) => void;
  selectedTags: string[];
}

export class Autocomplete {
  private suggestions: string[];
  private inputValue: string;
  private onSuggestionClick: (suggestion: string) => void;
  private selectedTags: string[];

  constructor(options: AutocompleteOptions) {
    this.suggestions = options.suggestions;
    this.inputValue = options.inputValue;
    this.onSuggestionClick = options.onSuggestionClick;
    this.selectedTags = options.selectedTags;
  }

  render(q: Quark) {
    const filteredSuggestions = this.suggestions.filter((suggestion) => suggestion.toLowerCase().includes(this.inputValue.toLowerCase()) && !this.selectedTags.includes(suggestion));

    if (!this.inputValue || filteredSuggestions.length === 0) {
      return;
    }

    $(q, 'div', 'autocomplete-items', {}, (q) => {
      filteredSuggestions.forEach((suggestion, index) => {
        $(q, 'div', 'autocomplete-item', {}, suggestion).addEventListener('click', () => {
          this.onSuggestionClick(suggestion);
        });
      });
    });
  }
}
