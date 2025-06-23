import React, { useState, lazy, Suspense } from 'react'
import Search from './components/Search'
import { createFilter } from 'react-search-input'
import { shuffle } from './util/shuffle'
import './styles/SearchBarMobileView.scss'
import BatchCards from './components/BatchCards'
import Navbar from './components/Navbar'
import persons from './assets/persons.json'
import { pageNames } from './util/pageNames'
import useForceUpdate from './util/useForceUpdate'
const SimpleMap = lazy(() => import('./components/Map'))

const people: any = persons

const style: React.CSSProperties = {
    background: '#fff',
    padding: '1rem',
    width: '100%',
    margin: '0 0 2rem 0',
    zIndex: 1,
    borderRadius: '5px',
}
const responsiveSearch = {
    width: '100%',
    marginBottom: '0.5rem',
    padding: '0.5rem',
}
const KEYS_TO_FILTERS = [
    'name',
    'jobTitle',
    'location.city',
    'location.state',
    'location.country',
]

function App() {
    const [searchfield, setSearchfield] = useState('')

    const [map, setMap] = useState(false)
    const [mapOrHomeTitle, setMapOrHomeTitle] = useState(pageNames.map) // pageNames.map is default

    const filteredPersons = (searchFilter: any) =>
        people.filter(createFilter(searchFilter, KEYS_TO_FILTERS))

    const forceUpdate = useForceUpdate()

    //note: shuffle function is not pure function, it mutates original array
    //in order to avoid memory duplication
    shuffle(people)

    function goBack() {
        setMap(!map)
        setMapOrHomeTitle(map ? pageNames.map : pageNames.home)
        setSearchfield('')
    }

    function shufflePeopleOnClick() {
        shuffle(people)
        forceUpdate()
    }

    return (
        <div className="flex flex-column min-vh-100 tc">
            <header className="custom--unselectable top-0 w-100 white custom--bg-additional3 custom--shadow-4 z-9999">
                <Navbar
                    onLogoClick={goBack}
                    onSearchChange={(e: any) => setSearchfield(e.target.value)}
                    onMapClick={goBack}
                    mapOrHomeTitle={mapOrHomeTitle}
                    shufflePeopleOnClick={shufflePeopleOnClick}
                />
            </header>
            <main className="flex-auto">
                {map ? (
                    <Suspense
                        fallback={
                            <div>
                                <p>Loading Map...</p>
                                <p>
                                    Try refreshing if it doesn't load or check
                                    internet connection and try again later.
                                </p>
                            </div>
                        }
                    >
                        <SimpleMap />
                    </Suspense>
                ) : (
                    <div id="sketch-particles">
                        <div
                            className="visible-on-mobileview-only"
                            style={style}
                        >
                            <Search
                                onSearchChange={(e: any) =>
                                    setSearchfield(e.target.value)
                                }
                                responsiveSearch={responsiveSearch}
                            />
                        </div>

                        <BatchCards
                            persons={filteredPersons(searchfield)}
                            numberPerBatch={16}
                        />
                    </div>
                )}
            </main>
            <div className="custom--top-button">
                <div
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-arrow-up"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default App
