const linAlg = require('linear-algebra')()

export class PowerRanker {
  items // Set({ id })
  matrix // linAlg.Matrix
  verbose // bool

  constructor(items, preferences, numResidents, verbose = false) {
    if (items.size < 2) {
      throw new Error('PowerRanker: Cannot rank less than two items')
    }

    this.items = items
    this.matrix = this.toMatrix(this.items, preferences, numResidents)
    this.verbose = verbose

    this.log('Matrix initialized')
  }

  log(msg) {
    /* istanbul ignore next */
    if (this.verbose) {
      console.log(msg)
    }
  }

  run(d = 1, epsilon = 0.001, nIter = 1000) {
    const weights = this.powerMethod(this.matrix, d, epsilon, nIter)
    return this.applyLabels(this.items, weights)
  }

  // O(items)
  applyLabels(items, eigenvector) {
    const itemMap = this.#toitemMap(items)
    if (itemMap.size !== eigenvector.length) {
      throw new Error('Mismatched arguments!')
    }
    itemMap.forEach((ix, item) => itemMap.set(item, eigenvector[ix]))
    return itemMap
  }

  // O(preferences)
  toMatrix(items, preferences, numResidents) {
    // [{ alpha, beta, preference }]
    const n = items.size
    const itemMap = this.#toitemMap(items)

    // Initialise the matrix with (implicit) neutral preferences
    const matrix = linAlg.Matrix.zero(n, n)
    // .plusEach(1)
    // .minus(linAlg.Matrix.identity(n)) // Zero on the diagonal, ones everywhere else
    // .mulEach(0.5)
    // .mulEach(numResidents); // Scale to .5 per resident
    // Add the preferences to the off-diagonals, removing the implicit neutral preference of 0.5
    // Recall that preference > 0.5 is flow towards, preference < 0.5 is flow away

    preferences.forEach((p) => {
      const alphaIx = itemMap.get(p.alpha)
      const betaIx = itemMap.get(p.beta)
      if (p.preference === 0) {
        matrix.data[alphaIx][betaIx] += 1 - p.preference
      } else if (p.preference === 1) {
        matrix.data[betaIx][alphaIx] += p.preference
      }
      // matrix.data[alphaIx][betaIx] += 1 - p.preference;
    })
    console.log(matrix)

    // Add the diagonals (sums of columns)
    this.#sumColumns(matrix).map((sum, ix) => (matrix.data[ix][ix] = sum)) // eslint-disable-line no-return-assign
    return matrix
  }

  // O(n^3)-ish
  powerMethod(matrix, d = 1, epsilon = 0.001, nIter = 1000) {
    if (matrix.rows !== matrix.cols) {
      throw new Error('Matrix must be square!')
    }
    const n = matrix.rows

    // Normalize matrix
    matrix = matrix.clone() // Make a copy for safety
    matrix.data = matrix.data.map((row) => {
      const rowSum = this.#sum(row)
      return row.map((x) => x / rowSum)
    })

    // Add damping factor
    matrix.mulEach_(d)
    matrix.plusEach_((1 - d) / n)

    // Initialize eigenvector to uniform distribution
    let eigenvector = linAlg.Vector.zero(n).plusEach(1.0 / n)

    // Power method
    let prev = eigenvector
    for (var i = 0; i < nIter; i++) {
      // eslint-disable-line no-var
      eigenvector = prev.dot(matrix)
      if (this.#norm(eigenvector.minus(prev).data[0]) < epsilon) break
      prev = eigenvector
    }

    this.log(`Eigenvector convergence after ${i} iterations`)
    return eigenvector.data[0]
  }

  // Internal

  #toitemMap(items) {
    // { id }
    return new Map(
      Array.from(items)
        .sort((a, b) => a - b) // Javascript is the worst
        .map((item, ix) => [item, ix]) // ItemName -> MatrixIdx
    )
  }

  #norm(array) {
    return Math.sqrt(this.#sum(array.map((x) => x * x)))
  }

  #sum(array) {
    return array.reduce((sumSoFar, val) => sumSoFar + val, 0)
  }

  #sumColumns(matrix) {
    return matrix.trans().data.map((col) => this.#sum(col))
  }
}
