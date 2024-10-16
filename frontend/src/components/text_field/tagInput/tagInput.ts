import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { TagList } from './tagList';
import { Autocomplete } from './autocomplete';
import './tagInput.scss';

interface TagInputOptions {
  suggestions: string[];
}

export class TagInput {
  private suggestions: string[];
  private inputValue: string = '';
  private selectedTags: string[] = [];
  private inputElement?: HTMLInputElement;
  private tagList?: TagList;

  constructor(options: TagInputOptions) {
    this.suggestions = options.suggestions;
  }

  private addTag(tag: string) {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.tagList?.updateTags(this.selectedTags); // Update the TagList
    }
    this.inputValue = '';
    if (this.inputElement) {
      this.inputElement.value = '';
    }
    this.renderAutocomplete();
  }
  private removeTag(tagToRemove: string) {
    this.selectedTags = this.selectedTags.filter((tag) => tag !== tagToRemove);
    this.tagList?.updateTags(this.selectedTags); // Update the TagList
    this.renderAutocomplete();
  }

  private handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.inputValue = target.value;
    this.renderAutocomplete();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && this.inputValue.trim()) {
      this.addTag(this.inputValue.trim());
      e.preventDefault();
    }
  }

  private renderAutocomplete() {
    const autocompleteContainer = document.querySelector('.autocomplete-container');
    if (autocompleteContainer) {
      autocompleteContainer.innerHTML = '';
      new Autocomplete({
        suggestions: this.suggestions,
        inputValue: this.inputValue,
        onSuggestionClick: (suggestion) => this.addTag(suggestion),
        selectedTags: this.selectedTags,
      }).render(autocompleteContainer as Quark);
    }
  }

  render(q: Quark) {
    $(q, 'div', 'tag-input-container', {}, (q) => {
      this.tagList = new TagList({ tags: this.selectedTags, onRemove: (tag) => this.removeTag(tag) });
      this.tagList.render(q);

      $(q, 'div', 'tag-input-wrapper', {}, (q: Quark) => {
        this.inputElement = $(q, 'input', 'tag-input', { type: 'text', placeholder: 'Add an area of expertise' }) as HTMLInputElement;
        this.inputElement.addEventListener('input', (e: Event) => this.handleInputChange(e));
        this.inputElement.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeyDown(e));
        $(q, 'div', 'autocomplete-container', {});
      });
    });
  }
}
