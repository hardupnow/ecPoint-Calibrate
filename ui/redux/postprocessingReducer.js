const defaultState = {
  thrGridIn: [],
  thrGridOut: [],
  fields: [],
  yLim: 100,
  tree: null,
}

const getFirstRow = fields =>
  [{ readOnly: true, value: 1 }].concat(
    _.flatMap(fields, _ => [{ value: '-inf' }, { value: 'inf' }])
  )

const generateInitialGrid = fields => {
  const header = [{ readOnly: true, value: '' }].concat(
    _.flatMap(fields, field => [
      { readOnly: true, value: field + '_thrL' },
      { readOnly: true, value: field + '_thrH' },
    ])
  )

  const firstRow = [getFirstRow(fields)]
  return [header].concat(firstRow)
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'POSTPROCESSING.SET_THRESHOLD_SPLITS': {
      return {
        ...state,
        thrGridIn:
          action.grid.length > 0 ? action.grid : generateInitialGrid(state.fields),
      }
    }

    case 'POSTPROCESSING.SET_WT_MATRIX': {
      return { ...state, thrGridOut: action.grid }
    }

    case 'POSTPROCESSING.SET_TREE': {
      return { ...state, tree: action.data }
    }

    case 'POSTPROCESSING.SET_FIELDS': {
      return {
        ...state,
        fields: action.data,
        thrGridIn: generateInitialGrid(action.data),
      }
    }

    case 'POSTPROCESSING.SET_Y_LIM': {
      return { ...state, yLim: action.value }
    }

    default: {
      return state
    }
  }
}
