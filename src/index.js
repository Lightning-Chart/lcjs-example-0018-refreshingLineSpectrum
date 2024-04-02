/*
 * LightningChartJS example for line chart application with rapidly changing data set
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, AutoCursorModes, Themes } = lcjs

const { createSpectrumDataGenerator } = require('@arction/xydata')

// Create XY Chart
const chart = lightningChart()
    .ChartXY({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Spectrum Line Chart')
    .setAutoCursorMode(AutoCursorModes.disabled)

// Set static Y axis interval.
chart.getDefaultAxisY().setScrollStrategy(undefined).setInterval({ start: 0.09, end: 0.9, stopAxisAfter: false })

// Add Line series
const series = chart.addLineSeries()

// Generate several spectrum data sets that will be displayed on after another.
createSpectrumDataGenerator()
    .setSampleSize(1024)
    .setNumberOfSamples(600)
    .setFrequencyStability(2)
    .setVariation(2)
    .generate()
    .toPromise()
    .then((dataSet) => {
        // dataSet contains many samples. Setup code that will change displayed sample once every frame.
        let iSample = 0
        const nextSample = () => {
            iSample = (iSample + 1) % dataSet.length
            const sample = dataSet[iSample]
            // Sample only contains Y values, use `addArrayY` to automatically generate X coordinate for each data point.
            series.clear().addArrayY(sample)
            requestAnimationFrame(nextSample)
        }
        nextSample()
    })
