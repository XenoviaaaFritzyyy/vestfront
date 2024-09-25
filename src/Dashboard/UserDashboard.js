import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Toolbar, Grid, Menu, MenuItem, Tabs, Tab, ListItemText, ListItem, Button, Divider } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { History, AddCircle, MonetizationOnRounded, Person2, Business} from '@mui/icons-material';

import Navbar from "../Navbar/Navbar";
import CreateFundingRoundDialog from "../Dialogs/CreateFundingRoundDialog";
import CreateBusinessProfileDialog from "../Dialogs/CreateBusinessProfileDialog";
import BusinessProfileTable from "../Tables/BusinessProfileTable";
import FundingRoundTable from "../Tables/FundingRoundTable";
import CapTable from "../Tables/CapTableTable";
import ActivitiesDialog from "../Dialogs/AcitivtiesDialog";

import { logActivity } from '../utils/activityUtils';

import MonthlyFundingChart from "../Components/Chart";

import { Container, HeaderBox, StatsBox, RecentActivityBox, RecentActivityList, TopInfoBox, TopInfoIcon, TopInfoText, TopInfoTitle,   CreateButton, GraphTitle, RecentActivityTitle } from "../styles/UserDashboard";
import { chartOptions } from "../styles/chartOptions";
import { createChartData } from "../utils/chartDataUtils";

import { Line } from 'react-chartjs-2';
// import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function UserDashboard() {
    const [tabValue, setTabValue] = useState(1);
        
    // PROFILE
    const [openCreateBusinessProfile, setCreateBusinessProfile] = useState(false);
    const [businessProfiles, setBusinessProfiles] = useState([]);
    const [selectedBusinessProfile, setSelectedBusinessProfile] = useState(null);
    const [openViewStartup, setOpenViewStartup] = useState(false);
    const [openViewInvestor, setOpenViewInvestor] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState(null);

    // FUNDING ROUND
    const [openCreateFundingRound, setOpenCreateFundingRound] = useState(false);
    const [fundingRounds, setFundingRounds] = useState([]);
    const [selectedFundingRoundDetails, setSelectedFundingRoundDetails] = useState(null);
    const [openViewFundingRound, setOpenViewFundingRound] = useState(false);
    const [filteredFundingRounds, setFilteredFundingRounds] = useState([]);

    // CAP TABLE
    const [selectedStartupCapTable, setSelectedStartupCapTable] = useState("Select Company");
    const [capTables, setCapTables] = useState([]);
    const [filteredCapTables, setFilteredCapTables] = useState([]);

    // COUNTS
    const [companyCount, setCompanyCount] = useState(0);
    const [investorCount, setInvestorCount] = useState(0);
    const [totalAmountFunded, setTotalAmountFunded] = useState(0);
    const [fundingRoundsCount, setFundingRoundsCount] = useState(0);
    const [moneyRaisedCount, setMoneyRaisedCount] = useState(0);
    const [highestMoneyRaisedCompany, setHighestMoneyRaisedCompany] = useState({ companyName: '', totalMoneyRaised: 0 });
    const [topInvestor, setTopInvestor] = useState({ topInvestorName: '' });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [recentActivities, setRecentActivities] = useState([]);

    const [userId, setUserId] = useState(null); // State to store the userId


    const handleViewHistoryClick = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    useEffect(() => {
        fetchBusinessProfiles();
        fetchFundingRounds();
        fetchAllInvestorsByEachUsersCompany();
        fetchRecentActivities();
        fetchCountInvestor();
        fetchTopInvestorContributor();

        const timer = setTimeout(() => {
            setTabValue(0);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // PROFILE
    const handleOpenBusinessProfile = () => {
        setCreateBusinessProfile(true);
    };
    
    const handleCloseBusinessProfile = async () => {
        setCreateBusinessProfile(false);
        await fetchBusinessProfiles();
        await fetchRecentActivities();
    };

    const handleOpenStartUp = (profile) => {
        setSelectedBusinessProfile(profile);
        setOpenViewStartup(true);
    };

    const handleCloseStartUp = () => {
        setOpenViewStartup(false);
    };

    const handleOpenInvestor = (profile) => {
        setSelectedBusinessProfile(profile);
        setOpenViewInvestor(true);
    };

    const handleCloseInvestor = () => {
        setOpenViewInvestor(false);
    };

    const handleOpenDeleteDialog = (profile) => {
        setProfileToDelete(profile);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = async () => {
        setOpenDeleteDialog(false);
    };

    const fetchRecentActivities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/activities', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                setRecentActivities(response.data);
            } else {
                console.error('Error fetching recent activities:', response.data);
            }
        } catch (error) {
            console.error('Error fetching recent activities:', error);
        }
    };

    const fetchBusinessProfiles = async () => {
        try {
            const responseStartups = await axios.get(`http://localhost:3000/startups`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

        const responseInvestors = await axios.get(`http://localhost:3000/investors`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }
        );

        const startups = responseStartups.data
            .filter((profile) => !profile.isDeleted)
            .map((profile) => ({ ...profile, type: "Startup" }));
        const investors = responseInvestors.data
            .filter((profile) => !profile.isDeleted)
            .map((profile) => ({ ...profile, type: "Investor" }));

        setBusinessProfiles([...investors, ...startups]);

        const allProfiles = [...investors, ...startups];
        setBusinessProfiles(allProfiles);

        setCompanyCount(startups.length);
        return allProfiles; 
    } catch (error) {
         console.error('Failed to fetch business profiles:', error);
    }
};

    const handleSoftDelete = async () => {
        if (!profileToDelete) {
            console.error("No profile selected");
            return;
        }

        try {
            const endpoint = `http://localhost:3000/startups/${profileToDelete.id}/delete`;

            await axios.put(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            await fetchBusinessProfiles();

            // Log recent activity
            const companyName = profileToDelete.companyName || 'Unknown Company';
            await logActivity(
                `${companyName} profile has been deleted.`,
                'Startup profile removed successfully.',
                fetchRecentActivities
            );

        } catch (error) {
            console.error('Failed to delete profile:', error);
        }
    };
    
    // FUNDING ROUND
    const handleOpenFundingRound = () => {
        setOpenCreateFundingRound(true);
    };

    const handleCloseFundingRound = async () => {
        setOpenCreateFundingRound(false);
        await fetchFundingRounds();
        await fetchRecentActivities();
    };    

    const handleCloseFundingProfile = () => {
        setOpenViewFundingRound(false);
        fetchFundingRounds();
    }

    const handleTotalAmountFundedChange = (total) => {
        setTotalAmountFunded(total);
    };

    const handleFundingRoundsCountChange = (count) => {
        setFundingRoundsCount(count);
    };

    const handleHighestMoneyRaisedCompanyChange = (company) => {
        setHighestMoneyRaisedCompany(company);
    };

    const handleMoneyRaisedCountChange = (count) => {
        setMoneyRaisedCount(count);
      };

    const fetchCountInvestor = async () => {
        try {
        const response = await axios.get(
            `http://localhost:3000/cap-table-investor`,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }
        );
        console.log("Number of Investors", response.data);
        setInvestorCount(response.data.length);
        } catch (error) {
        console.error("Error fetching funding round details:", error);
        }
    };

    const fetchTopInvestorContributor = async (userId) => {
        try {
          const response = await axios.get(
            `http://localhost:3000/cap-table-investor/${userId}/top`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Top Investor", response.data);
          setTopInvestor(response.data); // Set the fetched data into state
        } catch (error) {
          console.error("Error fetching top investor details:", error);
        }
      };

    const handleViewFundingRound = async (fundingRoundId) => {
        try {
        const response = await axios.get(
            `http://localhost:3000/funding-rounds/${fundingRoundId}`,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }
        );
        console.log("Funding Round Details:", response.data);
        setSelectedFundingRoundDetails(response.data);
        setOpenViewFundingRound(true);
        } catch (error) {
        console.error("Error fetching funding round details:", error);
        }
    };

    const handleSoftDeleteFundingRound = async (fundingRoundId) => {
        try {
        const fundingRoundToDelete = fundingRounds.find(round => round.id === fundingRoundId);

        if (fundingRoundToDelete) {
            const companyName = fundingRoundToDelete?.startup?.companyName || 'Unknown Company';
            const fundingType = fundingRoundToDelete?.fundingType || 'Unknown Funding Type';

            await axios.put(`http://localhost:3000/funding-rounds/${fundingRoundId}/delete`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Remove the deleted funding round 
            const updatedFundingRounds = fundingRounds.filter(round => round.id !== fundingRoundId);
            setFundingRounds(updatedFundingRounds);
            setFilteredFundingRounds(updatedFundingRounds);

            await logActivity(
                `${companyName} - ${fundingType} funding round has been deleted.`,
                'Funding round removed successfully.',
                fetchRecentActivities                );
            }
        } catch (error) {
            console.error('Failed to soft delete funding round:', error);
        }
    };

    const fetchFundingRounds = async () => {
      
        try {
            const response = await axios.get('http://localhost:3000/funding-rounds/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            setFundingRounds(response.data);
            setFilteredFundingRounds(response.data);
        } catch (error) {
            console.error('Error fetching funding rounds:', error);
        }
    };

    // CAP TABLE
    useEffect(() => {
        if (selectedStartupCapTable === 'Select Company') {
            fetchAllInvestorsByEachUsersCompany();
        } else {
            // fetchCapTable(selectedStartupCapTable);
        }
    }, [selectedStartupCapTable]);
    

    const fetchAllInvestorsByEachUsersCompany = async (companyId) => {
        try {
            const response = await axios.get(`http://localhost:3000/funding-rounds/${companyId}/investors/all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCapTables(response.data);
            setFilteredCapTables(response.data);
        } catch (error) {
            console.error('Error fetching funding rounds:', error);
        }
    };

  const handleStartupChangeCapTable = (event) => {
    const selectedCompanyId = event.target.value;
    setSelectedStartupCapTable(selectedCompanyId);
    fetchAllInvestorsByEachUsersCompany(selectedCompanyId);
  };

    // Monthly Funding Chart
    // const MonthlyFundingChart = ({ userId }) => {
    //     const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    //     const [loading, setLoading] = useState(true);
    
    //     useEffect(() => {
    //         const fetchMonthlyFunding = async () => {
    //             const userId = localStorage.getItem('userId');
    
    //             if (!userId) {
    //                 console.error('User ID is not available');
    //                 return;
    //             }
    
    //             try {
    //                 const response = await axios.get(`http://localhost:3000/funding-rounds/monthly-funding/${userId}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //                     },
    //                 });
    
    //                 const data = response.data;
    //                 const chartData = createChartData(data); // Use the utility function
    
    //                 setChartData(chartData);
    //                 setLoading(false);
    //             } catch (error) {
    //                 console.error('Error fetching monthly funding data:', error);
    //                 setLoading(false);
    //             }
    //         };
    
    //         fetchMonthlyFunding();
    //     }, [userId]);
    
    //     if (loading) return <p>Loading chart data...</p>;
    
    //     return (
    //         <div style={{ height: '400px', width: '100%' }}>
    //             <Line data={chartData} options={chartOptions} />
    //         </div>
    //     );
    // };


return (
    <>
      <Navbar />
      <Toolbar />

      <Container>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <HeaderBox>
                    <Typography variant="h5">User Dashboard</Typography>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                        <>
                            <CreateButton {...bindTrigger(popupState)}><AddCircle sx={{ mr: 1}} />Create</CreateButton>
                            <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={() => { handleOpenBusinessProfile(); popupState.close(); }}> 
                                <Person2 sx={{ mr: 1, color: "#007490" }} /> Business Profile
                            </MenuItem>
                            
                            <MenuItem onClick={() => { handleOpenFundingRound(); popupState.close(); }}> 
                                <MonetizationOnRounded sx={{ mr: 1, color: "#007490" }} /> Funding Round
                            </MenuItem>
                            </Menu>
                        </>
                        )}
                    </PopupState>
                </HeaderBox>
            </Grid>

            {/* Top Row - 5 Boxes */}
            <Grid item xs={12} sm={6}>
                <TopInfoBox>
                    <TopInfoIcon><Business sx={{ color: '#005b6e' }} /></TopInfoIcon>
                    <TopInfoText>Highest-Funded Company</TopInfoText>
                    <TopInfoTitle>{highestMoneyRaisedCompany.companyName || 'None'}</TopInfoTitle>
                </TopInfoBox>
            </Grid>

            <Grid item xs={12} sm={6}>
                <TopInfoBox>
                    <TopInfoIcon><Person2 sx={{ color: '#005b6e' }} /></TopInfoIcon>
                    <TopInfoText>Top Investment Contributor</TopInfoText>
                    <TopInfoTitle>{topInvestor.topInvestorName || 'None'}</TopInfoTitle>
                </TopInfoBox>
            </Grid>

            <Grid item xs={12} sm={3}>
                <StatsBox>
                    <TopInfoText>Funded Companies</TopInfoText>
                    <TopInfoTitle>{moneyRaisedCount} out of {companyCount}</TopInfoTitle>
                </StatsBox>
            </Grid>

            <Grid item xs={12} sm={2}>
                <StatsBox>
                    <TopInfoText>Company Count</TopInfoText>
                    <TopInfoTitle>{companyCount}</TopInfoTitle>
                </StatsBox>
            </Grid>

            <Grid item xs={12} sm={2}>
                <StatsBox>
                    <TopInfoText>Investor Count</TopInfoText>
                    <TopInfoTitle>{investorCount}</TopInfoTitle>
                </StatsBox>
            </Grid>

            <Grid item xs={12} sm={2}>
                <StatsBox>
                    <TopInfoText>Funding Rounds</TopInfoText>
                    <TopInfoTitle>{fundingRoundsCount}</TopInfoTitle>
                </StatsBox>
            </Grid>

            <Grid item xs={12} sm={3}>
                <StatsBox>
                    <TopInfoText>Total Amount Funded</TopInfoText>
                    <TopInfoTitle>{totalAmountFunded.toLocaleString()}</TopInfoTitle>
                </StatsBox>
            </Grid>

          {/* Middle Row - Two Boxes */}
          <Grid item xs={12} sm={9}>
            <RecentActivityBox>
              <GraphTitle>Monthly Funding Overview</GraphTitle>
              <MonthlyFundingChart userId={userId} />
            </RecentActivityBox>
          </Grid>

          <Grid item xs={12} sm={3}>
            <RecentActivityBox>
                <RecentActivityTitle><History sx={{ mr: 1 }} />Recent Activity</RecentActivityTitle>
                <Divider />
                <RecentActivityList>
                {recentActivities.length === 0 ? (
                    <ListItem>
                    <ListItemText primary="No recent activity" />
                    </ListItem>
                ) : (
                    recentActivities
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 10)
                    .map((activity, index) => {
                        const formattedTimestamp = new Date(activity.timestamp).toLocaleString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true,
                        });

                        return (
                        <div key={index}>
                            <ListItem>
                            <ListItemText
                                primary={activity.action}
                                secondary={
                                <div>
                                    <div>{activity.details}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#757575' }}>{formattedTimestamp}</div>
                                </div>
                                } />
                            </ListItem>
                            {index < recentActivities.length - 1 && <Divider />} 
                        </div>
                        );
                    })
                )}
                {recentActivities.length > 10 && (
                    <Box display="flex" justifyContent="center" mt={2}>
                    <Button size="small" variant="contained" color="primary" onClick={handleViewHistoryClick}>
                        View History
                    </Button>
                    </Box>
                )}
                </RecentActivityList>
            </RecentActivityBox>
            </Grid>

            <Grid item xs={12}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs"
                    sx={{ mt: 2, "& .MuiTabs-indicator": { backgroundColor: "#007490" }, }}>
                <Tab label="My Profile" 
                    sx={{ color: tabValue === 0 ? "#007490" : "text.secondary", "&.Mui-selected": { color: "#007490",},}}/>
                <Tab label="My Funding Round"
                    sx={{color: tabValue === 1 ? "#007490" : "text.secondary", "&.Mui-selected": {color: "#007490",},}}/>
                <Tab label="My Captable"
                    sx={{ color: tabValue === 2 ? "#007490" : "text.secondary", "&.Mui-selected": { color: "#007490", },}}/>
                </Tabs>

                <Box sx={{ pt: 3}}>
                    {tabValue === 0 && (
                        <BusinessProfileTable 
                            businessProfiles={businessProfiles}
                            handleOpenStartUp={handleOpenStartUp}
                            handleOpenInvestor={handleOpenInvestor}
                            handleOpenDeleteDialog={handleOpenDeleteDialog}
                            selectedBusinessProfile={selectedBusinessProfile}
                            openViewStartup={openViewStartup}
                            openViewInvestor={openViewInvestor}
                            openDeleteDialog={openDeleteDialog}
                            handleCloseStartUp={handleCloseStartUp}
                            handleCloseInvestor={handleCloseInvestor}
                            handleCloseDeleteDialog={handleCloseDeleteDialog}
                            handleSoftDelete={handleSoftDelete}
                            profileToDelete={profileToDelete}/>                            
                        )}
                                
                    {tabValue === 1 && (
                        <FundingRoundTable 
                            filteredFundingRounds={filteredFundingRounds}
                            fundingRounds={fundingRounds}
                            handleViewFundingRound={handleViewFundingRound}
                            handleSoftDeleteFundingRound={handleSoftDeleteFundingRound}
                            selectedFundingRoundDetails={selectedFundingRoundDetails}
                            openViewFundingRound={openViewFundingRound}
                            handleCloseFundingRound={handleCloseFundingRound}
                            handleCloseFundingProfile={handleCloseFundingProfile}
                            businessProfiles={businessProfiles}
                            onTotalAmountFundedChange={handleTotalAmountFundedChange}
                            onFundingRoundsCountChange={handleFundingRoundsCountChange}
                            onMoneyRaisedCountChange={handleMoneyRaisedCountChange}
                            onHighestMoneyRaisedCompanyChange={handleHighestMoneyRaisedCompanyChange} />
                        )}

                    {tabValue === 2 && (
                        <CapTable 
                            filteredCapTables={filteredCapTables}
                            businessProfiles={businessProfiles} 
                            selectedStartupCapTable={selectedStartupCapTable} 
                            handleStartupChangeCapTable={handleStartupChangeCapTable} />
                        )}
                    </Box>
                </Grid>  
            </Grid>

            <CreateBusinessProfileDialog open={openCreateBusinessProfile} onClose={handleCloseBusinessProfile} />
            <CreateFundingRoundDialog open={openCreateFundingRound} onClose={handleCloseFundingRound} />
            <ActivitiesDialog open={dialogOpen} onClose={handleCloseDialog} activities={recentActivities}/>
        </Container>
    </>
  );
}

export default UserDashboard;