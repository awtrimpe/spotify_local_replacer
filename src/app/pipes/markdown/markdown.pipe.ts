import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'appMarkdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  transform(text: string): string {
    return marked.parse(text).toString();
  }
}
