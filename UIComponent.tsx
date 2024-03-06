import React from "react"
import { createRoot } from 'react-dom/client'

function Univer() {
	return (
		<h4>hello, this is Univer</h4>
	)
}


// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('app')!).render(<Univer />)
