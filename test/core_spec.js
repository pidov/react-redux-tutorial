import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('Application logic: ', () => {

	describe('setEntries', () => {

		it('Adds the entries to the state', () => {
			const state = Map();
			const entries = List.of('Trainspotting', '28 Days Later');
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', '28 Days Later')
			}));
		});

		it('Converts to immutable', () => {
			const state = Map();
			const entries = ['Trainspotting', '28 Days Later'];
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', '28 Days Later')
			}));
		})

	});

	describe('next', () => {
		it('Takes the next two entries under vote', () => {
			const state = Map({
				entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
			});
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later')
				}),
				entries: List.of('Sunshine')
			}))
		})

		it('Puts the winner from the vote back to entries', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 4,
						'28 Days Later': 2
					})
				}),
				entries: List.of('Sunshine', 'Millions', '127 Hours')
			})
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Sunshine', 'Millions')
				}),
				entries: List.of('127 Hours', 'Trainspotting')
			}))
		})

		it('Puts both back to entries if tied', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 4,
						'28 Days Later': 4
					})
				}),
				entries: List.of('Sunshine', 'Millions', '127 Hours')
			})
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Sunshine', 'Millions')
				}),
				entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
			}))
		});

		it('Marks the winner when just one entry left', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 5,
						'28 Days Later': 2
					})
				}),
				entries: List()
			})
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				winner: 'Trainspotting'
			}))
		})

	});

	describe('vote', () => {
		it('Casts a vote and creates a tally', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later')
				}),
				entries: List()
			});
			const nextState = vote(state, 'Trainspotting');

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 1
					})
				}),
				entries: List()
			}))
		})

		it('Adds to existing tally', () => {
			const state = Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 5,
						'28 Days Later': 12
					})
				}),
				entries: List()
			})

			const nextState = vote(state, 'Trainspotting');
			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 6,
						'28 Days Later': 12
					})
				}),
				entries: List()
			}))
		})
	});

})