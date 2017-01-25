describe('component schema test suit', function () {
  const component = require('../../app/share/schema')
    .component;

  it('should be an object', function* () {
    expect(component.type)
      .toBe('object');
  });

  it('should require name and values to exist', function* () {
    expect(component.required)
      .toContain('name');
    expect(component.required)
      .toContain('values');
  });

  it('should have properties', function* () {
    expect(component.properties)
      .not.toBeUndefined();
  });

  it('should have a name of type string', function* () {
    expect(component.properties.name)
      .not.toBeUndefined();
    expect(component.properties.name.type)
      .toBe('string');
  });

  it('should have a values of type array', function* () {
    expect(component.properties.values)
      .not.toBeUndefined();
    expect(component.properties.values.type)
      .toBe('array');
  });

  it('values should contain min 1 item', function* () {
    expect(component.properties.values.minItems)
      .toEqual(1);
  });

  it('should require name to be at least 3 characters in length', function* () {
    expect(component.properties.name.minLength)
      .toEqual(3);
  });

  it('should not allow additional properties', function* () {
    expect(component.additionalProperties)
      .toBeFalsy();
  });
});
