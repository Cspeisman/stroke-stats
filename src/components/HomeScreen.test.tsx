import { HomeScreen } from "./HomeScreen"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

describe('HomeScreen', () => {
    it('should render', () => {
        render(<HomeScreen />)
        screen.getByText('Home')
    })
})
