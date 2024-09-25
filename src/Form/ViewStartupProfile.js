import { useState, useRef, useEffect } from 'react';
import countries from '../static/countries';
import industries from '../static/industries';

import { Box, Typography, TextField, Avatar, Select, MenuItem, Grid, FormControl, Button, Autocomplete} from '@mui/material';
import axios from 'axios';

function ViewStartupProfile({ profile }) {
    const [avatar, setAvatar] = useState('');
    const fileInputRef = useRef(null);
    const [isEditable, setIsEditable] = useState(false);

    let month = '', day = '', year = '';
    if (profile && profile.foundedDate) {
        [month, day, year] = profile.foundedDate.split(/[\s,]+/);
    }
    
    const [foundedMonth, setFoundedMonth] = useState(month);
    const [foundedDay, setFoundedDay] = useState(day);
    const [foundedYear, setFoundedYear] = useState(year);
    const [typeOfCompany, setTypeOfCompany] = useState(profile ? profile.typeOfCompany : '');
    const [numberOfEmployees, setNumberOfEmployees] = useState(profile ? profile.numberOfEmployees : '');
    const [phoneNumber, setPhoneNumber] = useState(profile ? profile.phoneNumber : '');
    const [contactEmail, setContactEmail] = useState(profile ? profile.contactEmail : '');
    const [industry, setIndustry] = useState(profile ? profile.industry : '');
    const [companyName, setCompanyName] = useState(profile ? profile.companyName : '');
    const [companyDescription, setCompanyDescription] = useState(profile ? profile.companyDescription : '');
    const [streetAddress, setStreetAddress] = useState(profile ? profile.streetAddress : '');
    const [country, setCountry] = useState(profile ? profile.country : '');
    const [city, setCity] = useState(profile ? profile.city : '');
    const [state, setState] = useState(profile ? profile.state : '');
    const [postalCode, setPostalCode] = useState(profile ? profile.postalCode : '');
    const [website, setWebsite] = useState(profile ? profile.website : '');
    const [facebook, setFacebook] = useState(profile ? profile.facebook : '');
    const [twitter, setTwitter] = useState(profile ? profile.twitter : '');
    const [instagram, setInstagram] = useState(profile ? profile.instagram : '');
    const [linkedIn, setLinkedIn] = useState(profile ? profile.linkedIn : '');

    const days = [...Array(31).keys()].map(i => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2000, i, 1));
    });
    const years = [...Array(51).keys()].map(i => new Date().getFullYear() - i);

    const handleAvatarClick = (event) => {
        event.preventDefault(); // Prevent default action
        event.stopPropagation(); // Stop the click from propagating to the input
        fileInputRef.current.click();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);

            // Directly call the upload function when a new file is selected
            handleUploadProfilePicture(file);
        }
    };

    const handleUpdateProfile = async () => {
        if (isEditable) {
        try {
          const profileData = {
            streetAddress: streetAddress,
            country: country,
            city: city,
            state: state,
            postalCode: postalCode,
            website: website,
            facebook: facebook,
            twitter: twitter,
            instagram: instagram,
            linkedIn: linkedIn,
            companyName: companyName,
            companyDescription: companyDescription,
            foundedDate: `${foundedMonth} ${foundedDay}, ${foundedYear}`,
            typeOfCompany: typeOfCompany,
            numberOfEmployees: numberOfEmployees,
            phoneNumber: phoneNumber,
            contactEmail: contactEmail,
            industry: industry,
          };
      
          const endpoint = `http://localhost:3000/startups/${profile.id}`; // replace with the id of the profile

        await axios.put(endpoint, profileData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        // After updating the profile, check if there's a new profile picture to upload
        await handleUploadProfilePicture();
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    }
    setIsEditable(!isEditable);
    };

    const handleUploadProfilePicture = async () => {
        if (fileInputRef.current.files[0]) {
          try {
            const pictureFormData = new FormData();
            pictureFormData.append('file', fileInputRef.current.files[0]);
      
            // Use the PUT method to update the startup's profile picture
            const pictureEndpoint = `http://localhost:3000/profile-picture/startup/${profile.id}/update`;
      
            await axios.put(pictureEndpoint, pictureFormData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
              },
            });
      
            // Fetch the updated profile picture and set it in the state
            await fetchProfilePicture();
          } catch (error) {
            console.error('Failed to upload profile picture:', error);
          }
        }
      };
      

      const fetchProfilePicture = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/profile-picture/startup/${profile.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob', // Important for getting the image as a blob
          });
      
          // Create a URL for the blob
          const imageUrl = URL.createObjectURL(response.data);
          setAvatar(imageUrl);
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      };

      useEffect(() => {
        if (profile.id) {
          fetchProfilePicture();
        }
      }, [profile.id]); // Add profile.id as a dependency

    return (
        <>
        <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden', maxWidth: '1000px',  background: '#F2F2F2'}}>

            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                Upload Business Profile
            </Typography>

            <Grid item xs={12} sm={3}>
                <label htmlFor="avatar-upload" onClick={handleAvatarClick}>
                <Avatar
                        sx={{
                            width: 200,
                            height: 200,
                            mb: 2,
                            ml: 49.5,
                            cursor: 'pointer',
                            border: '5px rgba(0, 116, 144, 1) solid'
                        }}
                        src={avatar}
                        onClick={handleAvatarClick} // Attach the event handler here
                    />
                </label>
            
                <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                onChange={handleAvatarChange}
                disabled={!isEditable} 
                ref={fileInputRef}
                style={{ display: 'none'}}/>                      
            </Grid>

            <Box component="main" sx={{mr: 5, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                Overview
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11.4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <label>Company Name *</label>
                            <TextField 
                                fullWidth 
                                variant="outlined"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)} disabled={!isEditable}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                        </Grid>

                        <Grid item xs={12}>
                            <label>Company Description *</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={companyDescription}
                                onChange={(e) => setCompanyDescription(e.target.value)} disabled={!isEditable} 
                                multiline
                                rows={5}/>
                        </Grid>

                    <Grid item xs={4}>
                        <label><b>Founded Date *</b><br/>Month</label>
                        <FormControl fullWidth variant="outlined">
                            <Select
                                labelId="month-label"
                                value={foundedMonth}
                                onChange={(e) => setFoundedMonth(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}>  
                                {months.map((month) => (
                                    <MenuItem key={month} value={month}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <label><br/>Day</label>
                        <FormControl fullWidth variant="outlined">
                            <Select
                                labelId="day-label"
                                value={foundedDay}
                                onChange={(e) => setFoundedDay(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}>
                                {days.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                    <label><br/>Year</label>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            labelId="year-label"
                            value={foundedYear}
                            onChange={(e) => setFoundedYear(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}>
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>
                    <label>Type of Company *</label>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>  
                            <Select 
                                fullWidth 
                                variant="outlined"
                                value={typeOfCompany}
                                onChange={(e) => setTypeOfCompany(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}>
                                <MenuItem value={'profit'}>Profit</MenuItem>
                                <MenuItem value={'non-profit'}>Non-Profit</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={4}>
                    <label>No. of Employees *</label>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>  
                            <Select 
                                fullWidth 
                                variant="outlined"
                                value={numberOfEmployees}
                                onChange={(e) => setNumberOfEmployees(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}>
                                <MenuItem value={'lessthan10'}>less than 10</MenuItem>
                                <MenuItem value={'10-50'}>10-50</MenuItem>
                                <MenuItem value={'50-100'}>50-100</MenuItem>
                                <MenuItem value={'100 above'}>100 above</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={4}>
                    <label>Phone Number *</label>
                        <TextField fullWidth variant="outlined" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} inputProps={{ min: 0, step: 1, pattern: "\\d{11}" }} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                </Grid>

                <Grid item xs={12}>
                    <label>Contact Email *</label>
                        <TextField fullWidth variant="outlined" type='email' value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

        <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
            Location
        </Typography>

        <Grid container spacing={3} sx={{ ml: 2 }}>
            <Grid item xs={12} sm={11.4}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <label>Street Address *</label>
                        <TextField fullWidth variant="outlined" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <label>Country *</label>
                        <Autocomplete
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            value={countries.find(c => c.label === country) || null}
                            onChange={(event, newValue) => {
                                setCountry(newValue ? newValue.label : '');
                            }}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    <img
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                        alt=""
                                    />
                                    {option.label} ({option.code}) +{option.phone}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    }}
                                    disabled={!isEditable}/>
                            )}
                            sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px'} }}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <label>City *</label>
                        <TextField fullWidth variant="outlined" value={city} onChange={(e) => setCity(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                    </Grid>

                    <Grid item xs={4}>
                        <label>State *</label>
                        <TextField fullWidth variant="outlined" value={state} onChange={(e) => setState(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                    </Grid>

                    <Grid item xs={4}>
                        <label>Postal/Zip Code *</label>
                        <TextField fullWidth variant="outlined" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

        <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
            Industry
        </Typography>

        <Grid container spacing={3} sx={{ ml: 2 }}>
        <Grid item xs={12} sm={11.4}>
            <Grid container spacing={2}>
            <Grid item xs={12}>  
                <Select fullWidth variant="outlined" value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={!isEditable} sx={{ height: '45px' }}>
                {industries.map(industry => (
                    <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                ))}
                </Select>
            </Grid>
            </Grid>
        </Grid>
        </Grid>

        <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
            Links
        </Typography>

        <Grid container spacing={3} sx={{ ml: 2, mb: 2 }}>
            <Grid item xs={12} sm={11.4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <label>Website</label>
                        <TextField fullWidth variant="outlined" value={website} onChange={(e) => setWebsite(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                    </Grid>

                    <Grid item xs={12}>
                        <label>Facebook</label>
                        <TextField fullWidth variant="outlined" value={facebook} onChange={(e) => setFacebook(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                    </Grid>

                    <Grid item xs={12}>
                        <label>Twitter</label>
                        <TextField fullWidth variant="outlined" value={twitter} onChange={(e) => setTwitter(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                    </Grid>

                    <Grid item xs={12}>
                        <label>Instagram</label>
                        <TextField fullWidth variant="outlined" value={instagram} onChange={(e) => setInstagram(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                    </Grid>

                    <Grid item xs={12}>
                        <label>LinkedIn</label>
                        <TextField fullWidth variant="outlined" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Button variant="contained" sx={{ width: 150, background: 'rgba(0, 116, 144, 1)', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: 'rgba(0, 116, 144, 1)' } }} style={{marginLeft: '83.5%'}} onClick={handleUpdateProfile}>
            {isEditable ? 'Save Changes' : 'Edit Profile'}
        </Button>
        </Box>
        </Box>
        </>
    );
}

export default ViewStartupProfile;
