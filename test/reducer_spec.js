import {Map, List, fromJS} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer';

describe('reducer', () => {
	it('handles SET_ENTERIES', () => {	
		const initialState = Map();
		const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
		const state = reducer(initialState, action);

		expect(state).to.equal(fromJS({
			entries: ['Trainspotting']
		}))
	})

	it('handles VOTE', () => {
		const initialState = fromJS({
			vote: {
				pair: ['Trainspotting', '28 days of summer']
			},
			entries: []
		});
		const action = {type: 'VOTE', entry: 'Trainspotting'}
		const state = reducer(initialState, action);

		expect(state).to.equal(fromJS({
			vote: {
				pair: ['Trainspotting', '28 days of summer'],
				tally: {
					'Trainspotting': 1
				}
			},
			entries: []
		}))
	})

	it('handles NEXT', () => {
		const initialState = fromJS({
			vote: {
				pair: ['Trainspotting', '28 days of summer'],
				tally: {
					'Trainspotting': 5,
					'28 days of summer': 2
				}
			},
			entries: ['Some shit']
		});
		const action = {type: 'NEXT'}
		const state = reducer(initialState, action);

		expect(state).to.equal(fromJS({
			vote: {
				pair: ['Some shit', 'Trainspotting']
			},
			entries: []
		}))
	})

	it('has initial state', () => {
		const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
		const nextState = reducer(undefined, action);
		expect(nextState).to.equal(fromJS({
			entries: ['Trainspotting']
		}))
	})

	it('Can be used with reducer', () => {
		const actions = [
			{type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
		    {type: 'NEXT'},
		    {type: 'VOTE', entry: 'Trainspotting'},
		    {type: 'VOTE', entry: '28 Days Later'},
		    {type: 'VOTE', entry: 'Trainspotting'},
		    {type: 'NEXT'}
		];
		const finalState = actions.reduce(reducer, Map());

		expect(finalState).to.equal(fromJS({
			winner: 'Trainspotting'
		}))
	})
})