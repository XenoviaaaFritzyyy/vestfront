import React from 'react';
import { Typography, Toolbar, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from "../Navbar/Navbar";

const drawerWidth = 280;

function Faqs() {
    return (
        <>
            <Navbar />
            <Toolbar />
            <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, pt: '50px', pr: '50px' }}>
                <Typography variant="h4" gutterBottom>
                    Frequently Asked Questions (FAQs)
                </Typography>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">What is a startup investment?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            A startup investment refers to the process of providing capital to a newly established company or business. This funding helps startups grow their operations, develop products, and reach their market.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">What types of investments are available for startups?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Startups can receive several types of investments, including angel investments, venture capital, seed funding, and crowdfunding. Each type has its own benefits and criteria.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">How do I evaluate a startup for investment?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Evaluating a startup involves analyzing the business model, market potential, team experience, financial projections, and competitive landscape. It's crucial to conduct thorough due diligence before making an investment decision.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">What are the risks involved in startup investments?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Investing in startups carries inherent risks, including high failure rates, market volatility, and uncertain returns. It's important to diversify investments and be prepared for the possibility of losing the entire investment.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">What is StartUpVest?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            StartUpVest is a platform designed to connect startups with potential investors. It simplifies the process of showcasing startups and finding investors interested in funding them.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">How does StartUpVest work?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            StartUpVest allows users to create a profile either as a startup company, an investor, or both. Startup owners can create and manage their business profiles, manually add shareholders or investors, and showcase their company to potential backers. Investors can explore different startups and connect with them through external links provided in user profiles. Users have the flexibility to act as both a startup owner and an investor at the same time.</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Can I create more than one startup profile?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Yes, you can create multiple startup profiles if you manage more than one business. Each startup will have its own profile and funding rounds.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">What types of funding can I offer on StartUpVest?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <strong>Pre-seed:</strong> The earliest stage of funding, typically involving personal funds, friends, family, or angel investors. It's used to develop an idea into a business plan or build a minimum viable product (MVP).<br /><br />
                            
                            <strong>Seed:</strong> This stage involves raising capital to validate the product-market fit, build a team, and grow the business. Seed funding is often provided by angel investors or early-stage venture capital (VC) firms.<br /><br />
                            
                            <strong>Series A:</strong> At this stage, startups have a proven business model and are looking to scale. Series A funding is used to optimize the product, acquire more customers, and generate consistent revenue. It’s usually raised from venture capital firms.<br /><br />
                            
                            <strong>Series B:</strong> Startups at this stage are ready for major expansion, like growing the team, expanding to new markets, or significantly boosting revenue. Series B funding comes from VCs and sometimes late-stage investors.<br /><br />
                            
                            <strong>Series C:</strong> This stage is for companies that are already successful and are looking to expand further, either by launching new products, entering new markets, or acquiring other businesses. Series C funding often involves VCs, private equity firms, and hedge funds.<br /><br />
                            
                            <strong>Series D and beyond:</strong> Series D is less common and typically used for further expansion or to prepare the company for an IPO (Initial Public Offering) or a major acquisition. It may also occur if the company has not yet achieved the milestones needed for an IPO and needs additional funds to reach that goal.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">How do I find startups to invest in?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            You can browse startups in the Companies section based on criteria such as startup name, industry, and location. Use the search bar to find startups and view detailed profiles that match your investment goals.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">How do I contact a startup for more information?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Each startup profile includes external links to the founder’s website or social media. You can use these links to contact the startup directly for more information or to negotiate investment terms.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Who are the people behind StartUpVest?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Our team is dedicated to creating a seamless experience for both startups and investors. Here’s a brief introduction to the key members behind StartUpVest:
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <img src="/images/Abrea.png" alt="Abrea" style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
                                <p>Abrea<br />Team Lead<br /></p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <img src="/images/Alcordo.png" alt="Alcordo" style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
                                <p>Alcordo<br />Front-end Developer<br /></p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <img src="/images/Balingcasag.png" alt="Balingcasag" style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
                                <p>Balingcasag<br />Front-end Lead Developer<br /></p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <img src="/images/Biong.png" alt="Biong" style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
                                <p>Biong<br />Back-end Lead Developer<br /></p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <img src="/images/Borinaga.png" alt="Borinaga" style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
                                <p>Borinaga<br />Full-Stack Developer<br /></p>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>
    );
}

export default Faqs;
