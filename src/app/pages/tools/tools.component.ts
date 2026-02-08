import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { tools } from '../../core/consts';
import { MarkdownPipe } from '../../pipes/markdown/markdown.pipe';

@Component({
  selector: 'app-tools',
  template: `
    <h3>Tools</h3>
    <div class="flex flex-column gap-3">
      @for (tool of tools; track tool) {
        <p-card [header]="tool.title">
          <div class="flex justify-content-between align-items-center gap-3 ">
            <p>{{ tool.overview }}</p>
            <p-button
              label="Select"
              icon="pi pi-arrow-right"
              iconPos="right"
              [routerLink]="tool.routerLink"
            />
          </div>
          <p-accordion>
            <p-accordion-panel value="0">
              <p-accordion-header>Read More</p-accordion-header>
              <p-accordion-content>
                <span [innerHTML]="tool.description | appMarkdown"></span>
              </p-accordion-content>
            </p-accordion-panel>
          </p-accordion>
        </p-card>
      }
    </div>
  `,
  imports: [
    AccordionModule,
    ButtonModule,
    CardModule,
    MarkdownPipe,
    RouterLink,
  ],
})
export class ToolsComponent {
  readonly tools = tools;
}
