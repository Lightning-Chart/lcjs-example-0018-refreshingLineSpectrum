/*
 * LightningChartJS example for line chart application with rapidly changing data set
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, AutoCursorModes, Themes } = lcjs

const { createSpectrumDataGenerator } = require('@lightningchart/xydata')

// Create XY Chart
const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        legend: { visible: false },
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Spectrum Line Chart')
    .setCursorMode(undefined)

// Set static Y axis interval.
chart.getDefaultAxisY().setScrollStrategy(undefined).setInterval({ start: 0.09, end: 0.9, stopAxisAfter: false })

// Add Line series
const series = chart.addPointLineAreaSeries()

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
            series.setSamples({ yValues: sample })
            requestAnimationFrame(nextSample)
        }
        nextSample()
    })
