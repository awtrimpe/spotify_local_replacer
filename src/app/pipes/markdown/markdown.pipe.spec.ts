import { MarkdownPipe } from './markdown.pipe';

describe('MarkdownPipe', () => {
  let pipe: MarkdownPipe;

  beforeEach(() => {
    pipe = new MarkdownPipe();
  });

  describe('transform()', () => {
    it('should convert markdown', () => {
      const input = `# Hello World
            
1. New Thing`;
      const expected = `<h1>Hello World</h1>
<ol>
<li>New Thing</li>
</ol>
`;
      expect(pipe.transform(input)).toBe(expected);
    });

    it('should preserve raw text', () => {
      const input = 'Raw Text';
      expect(pipe.transform(input)).toBe(`<p>${input}</p>
`);
    });
  });
});
