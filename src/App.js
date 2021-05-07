import React from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
	buttons: {
		margin: "8pt",
	},
	contents: {
		margin: "8pt",
	},
})

function App() {
	const [result, setResult] = React.useState(null)
	const [results, setResults] = React.useState(null)
	const [finderStarted, setFinderStarted] = React.useState(false)
	const [numberStatistics, setNumberStatistics] = React.useState({})
	const [finder, setFinder] = React.useState(null)

	const classes = useStyles()

	const findPrimes = (event) => {
		setResult(null)
		setResults(null)
		let fndr = new Worker("primesFinder.js")
		setFinder(fndr)
		setFinderStarted(true)
		// send message to the worker
		fndr.postMessage({ startFrom: 3 })
		// receive results from the worker
		fndr.onmessage = function (message) {
			if (message.data.prime) {
				setResult(message.data.prime)
			}
			if (message.data.primes) {
				setResults(message.data.primes)
				setFinderStarted(false)
				let ar = {}
				for (let r in message.data.primes) {
					let textValue = "" + message.data.primes[r]
					for (let c in textValue) {
						let letter = textValue.charAt(c)
						if (!ar.hasOwnProperty(letter)) {
							ar[letter] = { value: 1, name: textValue.charAt(c) }
						} else {
							ar[letter].value += 1
						}
					}
				}

				setNumberStatistics(ar)
			}
		}
	}

	const analyse = (event) => {
		console.log("Posting worker a stop message")
		finder.postMessage({ stop: true })
		setFinderStarted(false)
	}

	let resultContent = <Typography>...</Typography>
	if (results !== null) resultContent = results.length

	return (
		<Box>
			<Typography className={classes.contents}>
				Prime: {result}
			</Typography>
			<Button
				className={classes.buttons}
				variant='outlined'
				disabled={finderStarted}
				color='primary'
				onClick={findPrimes}>
				Find primes
			</Button>

			<Button
				className={classes.buttons}
				variant='outlined'
				disabled={result === null}
				color='primary'
				onClick={analyse}>
				Calculate statistics
			</Button>
			<Box className={classes.contents}>
				<Typography>Found primes</Typography>
				{resultContent}
			</Box>
		</Box>
	)
}

export default App
