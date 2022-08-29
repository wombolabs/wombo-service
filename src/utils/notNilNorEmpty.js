import R from 'ramda';

export const notNilNorEmpty = R.complement(R.either(
  R.isNil,
  R.isEmpty,
));
