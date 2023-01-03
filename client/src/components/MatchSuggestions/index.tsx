//prettier-ignore
import { FilterCriteriaInternal, ProfilePublic, SortAndFilter, SortingCriteriaInternal } from '../../types';
//prettier-ignore
import { Alert, Box, Button, Container, styled } from '@mui/material';
import { useState } from 'react';
import { useStateValue } from '../../state';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getMatchSuggestions } from '../../services/search';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import PublicProfile from '../PublicProfile/PublicProfile';
import SortAndFilterPopper from './SortAndFilterPopper';
import withProfileRequired from '../ProfileRequired';
import LoadingIcon from '../LoadingIcon';

export const StyledMain = styled('div')`
	display: flex;
	flex-direction: column;
`;

const defaultSortCriteria: SortingCriteriaInternal = {
	sort: 'distance',
	isReversedOrder: false
};

const defaultFilterCriteria: FilterCriteriaInternal = {
	distance: { min: 2, max: 50 },
	age: { min: 18, max: 80 },
	rating: { min: 0, max: 100 },
	tags: { min: 0, max: 5 }
};

const Main = () => {
	const [{ loggedUser }] = useStateValue();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortAndFilter, setSortAndFilter] = useState<SortAndFilter>({
		sort: defaultSortCriteria,
		filter: defaultFilterCriteria
	});
	const [filteredIds, setFilteredIds] = useState<string[]>([]);

	const togglePopper = (event: React.MouseEvent<HTMLElement>) =>
		setAnchorEl(anchorEl ? null : event.currentTarget);

	const handleClickAway = () => setAnchorEl(null);

	const open = Boolean(anchorEl);
	const id = open ? 'popper' : undefined;

	const handleOnChange = (newSortAndFilter: SortAndFilter) => {
		setSortAndFilter(newSortAndFilter);
		setFilteredIds([]);
	};

	const {
		data: matchSuggestionsData,
		error: matchSuggestionsError
	}: {
		data: ProfilePublic[];
		error: Error | undefined;
	} = useServiceCall(
		async () => loggedUser && (await getMatchSuggestions(sortAndFilter)),
		[sortAndFilter]
	);

	if (matchSuggestionsError)
		return <Alert severity="error">Error loading page, please try again...</Alert>;

	if (!matchSuggestionsData) {
		return <LoadingIcon />;
	}

	return (
		<StyledMain>
			<ClickAwayListener onClickAway={handleClickAway}>
				<Box>
					<Button onClick={togglePopper} style={{ width: '80%' }}>
						Sort & Filter
					</Button>
					{open ? (
						<SortAndFilterPopper
							id={id}
							open={open}
							anchorEl={anchorEl}
							sortAndFilter={sortAndFilter}
							handleOnChange={handleOnChange}
						/>
					) : null}
				</Box>
			</ClickAwayListener>
			<Container sx={{ mb: 5 }}>
				{matchSuggestionsData
					.filter((profile) => filteredIds.indexOf(profile.id) < 0)
					.map((profile) => (
						<PublicProfile
							profileData={profile}
							key={profile.id}
							onAction={(p) => setFilteredIds([...filteredIds, p.id])}
						/>
					))}
			</Container>
		</StyledMain>
	);
};

export default withProfileRequired(Main);