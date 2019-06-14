import {sum} from "lodash"

export default {
  
  leastSquares: (xSeries, ySeries) => {
	let resp = {}
	const xSum = sum(xSeries)
	const ySum = sum(ySeries)
	const numPoints = xSeries.length
	let term1 = 0
	let term2 = xSum * ySum / numPoints
	let term3 = 0
	let term4 = xSum * xSum / numPoints

	xSeries.forEach(function(d, i) {
	  term1 += xSeries[i] * ySeries[i]
	  term3 += xSeries[i] * xSeries[i]
	})

	resp.slope = (term1 - term2) / (term3 - term4)
	resp.intercept = ySum / numPoints - resp.slope * xSum / numPoints

	return resp
  }

}