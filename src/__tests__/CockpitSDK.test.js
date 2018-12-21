import CockpitSDK from '../CockpitSDK';

test('Expect Cockpit.image to return array of numbers', () => {
  const cockpit = new CockpitSDK({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz',
  });
  const imageOptions = [10, 20, 30];

  const result = cockpit.image('bux', imageOptions);

  expect(result).toBe(
    '' +
      'foo/api/cockpit/image?d=1&lang=biz&o=1&src=bux&token=bar&w=10 10w, ' +
      'foo/api/cockpit/image?d=1&lang=biz&o=1&src=bux&token=bar&w=20 20w, ' +
      'foo/api/cockpit/image?d=1&lang=biz&o=1&src=bux&token=bar&w=30 30w',
  );
});

test('Expect Cockpit.image to return height', () => {
  const cockpit = new CockpitSDK({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz',
  });
  const imageOptions = {
    width: 200,
    height: 100,
  };

  const result = cockpit.image('bux', imageOptions);

  expect(result).toBe(
    'foo/api/cockpit/image?d=1&h=100&lang=biz&o=1&src=bux&token=bar&w=200',
  );
});

test('Expect Cockpit.image with pixel ratio', () => {
  const cockpit = new CockpitSDK({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz',
  });
  const imageOptions = {
    width: 200,
    height: 100,
    pixelRatio: 2,
  };

  const result = cockpit.image('bux', imageOptions);

  expect(result).toBe(
    'foo/api/cockpit/image?d=1&h=200&lang=biz&o=1&src=bux&token=bar&w=400',
  );
});

test('Expect Cockpit.image with array to return height', () => {
  const cockpit = new CockpitSDK({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz',
  });
  const imageOptions1 = {
    width: 200,
    height: 100,
  };

  const imageOptions2 = {
    width: 20,
    height: 10,
  };

  const result = cockpit.image('bux', [imageOptions1, imageOptions2]);

  expect(result).toBe(
    '' +
      'foo/api/cockpit/image?d=1&h=100&lang=biz&o=1&src=bux&token=bar&w=200 200w, ' +
      'foo/api/cockpit/image?d=1&h=10&lang=biz&o=1&src=bux&token=bar&w=20 20w',
  );
});

test('Expect Cockpit.image with array to return pixel ratio', () => {
  const cockpit = new CockpitSDK({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz',
  });
  const imageOptions1 = {
    pixelRatio: 2,
    width: 200,
    height: 100,
  };

  const imageOptions2 = {
    pixelRatio: 2,
    width: 20,
    height: 10,
  };

  const result = cockpit.image('bux', [imageOptions1, imageOptions2]);

  expect(result).toBe(
    '' +
      'foo/api/cockpit/image?d=1&h=200&lang=biz&o=1&src=bux&token=bar&w=400 200w, ' +
      'foo/api/cockpit/image?d=1&h=20&lang=biz&o=1&src=bux&token=bar&w=40 20w',
  );
});

test('Expect Cockpit.image with array to return different srcSet', () => {
  const cockpit = new CockpitSDK({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz',
  });
  const imageOptions1 = {
    width: 200,
    height: 100,
    srcSet: '1x',
  };

  const imageOptions2 = {
    ...imageOptions1,
    pixelRatio: 2,
    srcSet: '2x',
  };

  const result = cockpit.image('bux', [imageOptions1, imageOptions2]);

  expect(result).toBe(
    '' +
      'foo/api/cockpit/image?d=1&h=100&lang=biz&o=1&src=bux&token=bar&w=200 1x, ' +
      'foo/api/cockpit/image?d=1&h=200&lang=biz&o=1&src=bux&token=bar&w=400 2x',
  );
});

test('Expect Cockpit.image to return one filter', () => {
  const cockpit = new CockpitSDK({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz',
  });
  const imageOptions = {
    filters: { darken: 50 },
  };

  const result = cockpit.image('bux', imageOptions);

  expect(result).toBe(
    'foo/api/cockpit/image?d=1&lang=biz&o=1&src=bux&token=bar&f[darken]=50',
  );
});

test('Expect Cockpit.image to return multiple filters', () => {
  const cockpit = new CockpitSDK({
    host: 'foo',
    accessToken: 'bar',
    lang: 'biz',
  });

  const imageOptions = {
    filters: { darken: 50, pixelate: 40, desaturate: true, flip: 'x' },
  };

  const result = cockpit.image('bux', imageOptions);

  expect(result).toBe(
    'foo/api/cockpit/image?d=1&lang=biz&o=1&src=bux&token=bar&f[darken]=50&f[pixelate]=40&f[desaturate]=true&f[flip]=x',
  );
});
