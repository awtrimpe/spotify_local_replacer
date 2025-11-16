import { anyToString } from './utils';

describe('utilities', () => {
  it('should return string for string', () => {
    expect(anyToString('')).toEqual('');
    expect(anyToString('My String')).toEqual('My String');
  });

  it('should return string for array', () => {
    expect(anyToString([])).toEqual('[]');
  });

  it('should return string for object', () => {
    expect(anyToString({})).toEqual('{}');
  });

  it('should return string for numbers', () => {
    expect(anyToString(1)).toEqual('1');
    expect(anyToString(1.1)).toEqual('1.1');
  });

  it('should return string for boolean', () => {
    expect(anyToString(true)).toEqual('true');
    expect(anyToString(false)).toEqual('false');
  });

  it('should return string for undefined', () => {
    expect(anyToString(undefined)).toEqual('undefined');
  });

  it('should return string for null', () => {
    expect(anyToString(null)).toEqual('null');
  });
});
