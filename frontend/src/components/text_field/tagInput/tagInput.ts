import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { TagList } from './tagList';
import { Autocomplete } from './autocomplete';
import { FormTextField } from '../form.text_field';
import './tagInput.scss';

interface TagInputOptions {
  suggestions: string[];
  label: string;
  placeholder?: string;
  onChange?: (value: string[]) => void;
  name?: string;
}

export class TagInput {
  private suggestions: string[];
  private inputValue: string = '';
  private selectedTags: string[] = [];
  private textField?: FormTextField;
  private tagList?: TagList;
  private label?: string;
  private updateTags?: (tags: string[]) => void;
  public name?: string;

  constructor(options: TagInputOptions) {
    this.suggestions = options.suggestions;
    this.label = options.label;
    this.name = options.name;
    this.textField = new FormTextField({
      label: '',
      class: 'tag-input',
      parentClass: 'w-100',
      placeholder: options.placeholder || 'Add an area of expertise',
      onChange: (value: string) => {
        this.handleInputChange(value);
      },
      name: options.name,
      onKeyDown: (e: KeyboardEvent) => this.handleKeyDown(e),
      onFocus: (e: Event) => {
        this.renderAutocomplete();
      },
    });
    this.updateTags = options!.onChange;
  }

  private addTag(tag: string) {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.tagList?.updateTags(this.selectedTags); // Update the TagList
    }
    this.inputValue = '';
    this.textField?.setValue(''); // Clear the input field
    this.renderAutocomplete();
  }
  public addTags(tags: string[]) {
    this.selectedTags.push(...tags);
    this.tagList?.updateTags(this.selectedTags); // Update the TagList
  }
  public addClass(className: string) {
    this.textField?.addClass(className);
  }
  private removeTag(tagToRemove: string) {
    this.selectedTags = this.selectedTags.filter((tag) => tag !== tagToRemove);
    this.tagList?.updateTags(this.selectedTags); // Update the TagList
    this.renderAutocomplete();
  }

  private handleInputChange(value: string) {
    this.inputValue = value;
    this.renderAutocomplete();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && this.inputValue.trim()) {
      if (this.inputValue.trim() in this.suggestions) {
        this.addTag(this.inputValue.trim());
      }
      e.preventDefault();
    }
  }

  private renderAutocomplete() {
    const autocompleteContainer = document.querySelector(`.autocomplete-container-${this.name}`);
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
  public setOnChange(onChange: (tags: string[]) => void) {
    this.updateTags = onChange;
  }
  render(q: Quark) {
    $(q, 'div', 'parent-element', {}, (q) => {
      $(q, 'label', 'tag-input-label', {}, this.label);
      $(q, 'div', 'tag-input-container', {}, (q) => {
        this.tagList = new TagList({ tags: this.selectedTags, onRemove: (tag) => this.removeTag(tag), update: this.updateTags! });
        this.tagList.render(q);

        $(q, 'div', 'tag-input-wrapper w-100', {}, (q: Quark) => {
          this.textField?.render(q);
          $(q, 'div', `autocomplete-container autocomplete-container-${this.name}`, {});
        });
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if ((target && target.classList.contains('autocomplete-item')) || (target && target.classList.contains('tag-input'))) {
        return;
      } else {
        const autocompleteContainer = document.querySelector(`.autocomplete-container-${this.name}`);
        if (autocompleteContainer) {
          autocompleteContainer.innerHTML = '';
        }
      }
    });
  }
}
