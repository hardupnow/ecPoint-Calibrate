export { default } from './container'

export const isEmpty = state => (
  state.predictantPath === null ||
  state.predictorsPath === null
  // state.predictorCodes.length === 0
)