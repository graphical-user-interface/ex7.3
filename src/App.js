import React from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Container from "@material-ui/core/Container"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
	buttons: {
		marginTop: "8pt",
	},
	row: {
		marginTop: "15pt",
	},
})

function App() {
	const [results, setResults] = React.useState([])
	const [finderStarted, setFinderStarted] = React.useState(false)

	const [start, setStart] = React.useState(3)
	const [end, setEnd] = React.useState(10)

	const classes = useStyles()

	const findPrimes = (event) => {
		setResults([])

		if (start >= end) return

		let fndr = new Worker("primesFinder.js")
		setFinderStarted(true)
		// send message to the worker
		fndr.postMessage({ startFrom: start })

		// receive results from the worker
		fndr.onmessage = function (message) {
			if (message.data.primes) {
				setResults(message.data.primes)
				setFinderStarted(false)
			}
			if (message.data.prime >= end - start) {
				this.postMessage({ stop: true })
				setFinderStarted(false)
			}
		}
	}

	const handleStartChange = (e) => {
		setStart(e.target.value)
	}
	const handleEndChange = (e) => {
		setEnd(e.target.value)
	}

	return (
		<Container maxWidth='sm'>
			<Box className={classes.row}>
				<Typography className={classes.contents}>
					Find prime numbers
				</Typography>
				<Box className={classes.row}>
					<TextField
						value={start}
						variant='outlined'
						type='number'
						label='From'
						InputProps={{ inputProps: { min: 3 } }}
						onChange={handleStartChange}
					/>
				</Box>
				<Box className={classes.row}>
					<TextField
						value={end}
						variant='outlined'
						type='number'
						label='To'
						InputProps={{ inputProps: { min: 10 } }}
						onChange={handleEndChange}
					/>
				</Box>
				<Button
					variant='outlined'
					disabled={finderStarted}
					className={classes.buttons}
					onClick={findPrimes}>
					Find
				</Button>

				<ul
					style={{
						maxHeight: 300,
						overflow: "auto",
						padding: 0,
						listStyle: "inside",
					}}>
					{results.map((result, index) => {
						return <li key={result + "_" + index}>{result}</li>
					})}
				</ul>
			</Box>
		</Container>
	)
}

export default App
