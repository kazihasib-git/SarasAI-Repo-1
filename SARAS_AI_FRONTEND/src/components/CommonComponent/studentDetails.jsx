import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReactivateIcon from '@mui/icons-material/RestartAlt';
import CoachMenu from '../../pages/MODULE/coachModule/CoachMenu';
import videoIcon from '../../assets/video.svg';
import assessmentIcon from '../../assets/assessmenticon.svg';
import docIcon from '../../assets/doc.svg';
import card1Icon from '../../assets/card1.svg';
import background1Icon from '../../assets/background1.svg';
import activityBackgroundIcon from '../../assets/activitybackground.svg';
import activityIcon from '../../assets/activityicon.svg';
import dueBackgroundIcon from '../../assets/duedatebackground.svg';
import dueDateIcon from '../../assets/duedateicon.svg';

const StudentDetails = () => {
    const data = [
        {
            module: 'Module 5',
            activities: [
                { name: 'Activity 1', type: 'Video', status: 'Completed' },
                { name: 'Activity 2', type: 'Assessment', status: 'Completed' },
                { name: 'Activity 3', type: 'Doc', status: 'Locked' },
            ],
        },
        {
            module: 'Module 4',
            activities: [
                { name: 'Activity 1', type: 'Assessment', status: 'Ongoing' },
                { name: 'Activity 2', type: 'Video', status: 'Ongoing' },
            ],
        },
        {
            module: 'Module 3',
            activities: [
                { name: 'Activity 1', type: 'Assessment', status: 'Lapsed' },
                { name: 'Activity 2', type: 'Video', status: 'Lapsed' },
            ],
        },
    ];

    const getActivityIcon = type => {
        switch (type) {
            case 'Video':
                return videoIcon;
            case 'Assessment':
                return assessmentIcon;
            case 'Doc':
                return docIcon;
            default:
                return null;
        }
    };

    const getStatusStyle = status => {
        // Define styles based on status
        const styles = {
            Completed: {
                backgroundColor: '#14D2491A',
                color: '#14D249', // White text
            },
            //#14D249
            Ongoing: {
                backgroundColor: '#14D2491A',
                color: '#F48606',
            },
            Locked: {
                backgroundColor: '#14D2491A',
                color: '#FF0000',
            },
            Lapsed: {
                backgroundColor: '#14D2491A',
                color: '#FF0000',
            },
        };

        return (
            styles[status] || { backgroundColor: '#FFFFFF', color: '#000000' }
        ); // Default color
    };

    return (
        <div>
            <CoachMenu />
            <Box sx={{ padding: 4, position: 'relative' }}>
                <Button
                    sx={{
                        textTransform: 'none',
                        position: 'absolute',
                        top: 33,
                        right: 150,
                        border: '1px solid #F56D3B',
                        borderRadius: '50px',
                        color: '#F56D3B', // Text color
                        background: 'transparent', // Background color

                        '&:hover': {
                            backgroundColor: 'transparent',
                            borderColor: '#F56D3B',
                        },
                    }}
                >
                    View Academic Performance
                </Button>

                <Button
                    sx={{
                        textTransform: 'none',
                        position: 'absolute',
                        top: 33,
                        right: 28,
                        border: '1px solid #F56D3B',
                        borderRadius: '50px',
                        color: '#FFFFFF', // Text color
                        background: '#F56D3B', // Background color

                        '&:hover': {
                            backgroundColor: '#F56D3B',
                            borderColor: '#F56D3B',
                        },
                    }}
                >
                    Send Message
                </Button>

                <Typography variant="h4" gutterBottom fontFamily={'ExtraLight'}>
                    Aniket Sharma
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Bs in AI: Spring 24-28 | OS 101: US Batch 3, CL 201: IN
                    Batch 6
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 4,
                    }}
                >
                    <Card
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            width: '300px',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '45%',
                                right: '5%',
                                width: '18%',
                                height: '30%',
                                backgroundImage: `url(${background1Icon})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                zIndex: 1,
                                borderRadius: '50%',
                            }}
                        />
                        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h6">
                                Activities Scheduled
                            </Typography>
                            <Typography variant="h5">3</Typography>
                        </CardContent>
                        <Box
                            component="img"
                            src={card1Icon}
                            alt="Card Icon"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '10%',
                                width: '8%', // Size of card1.svg
                                height: 'auto',
                                zIndex: 3,
                            }}
                        />
                    </Card>
                    <Card
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            width: '300px',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '45%',
                                right: '5%',
                                width: '18%',
                                height: '30%',
                                backgroundImage: `url(${activityBackgroundIcon})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                zIndex: 1,
                                borderRadius: '50%',
                            }}
                        />
                        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h6">
                                Activities Completed
                            </Typography>
                            <Typography variant="h5">3</Typography>
                        </CardContent>
                        <Box
                            component="img"
                            src={activityIcon}
                            alt="Card Icon"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '10%',
                                width: '8%', // Size of card1.svg
                                height: 'auto',
                                zIndex: 3,
                            }}
                        />
                    </Card>
                    <Card
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            width: '300px',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '45%',
                                right: '5%',
                                width: '18%',
                                height: '30%',
                                backgroundImage: `url(${dueBackgroundIcon})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                zIndex: 1,
                                borderRadius: '50%',
                            }}
                        />
                        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h6">
                                Due Dates Missed
                            </Typography>
                            <Typography variant="h5">3</Typography>
                        </CardContent>
                        <Box
                            component="img"
                            src={dueDateIcon}
                            alt="Activity Icon"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '10%',
                                width: '8%',
                                height: 'auto',
                                zIndex: 3,
                            }}
                        />
                    </Card>
                </Box>

                {data.map((module, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            fontFamily={'ExtraLight'}
                        >
                            {module.module}
                        </Typography>
                        <Table
                            sx={{
                                backgroundColor: '#FFFFFFB2',
                                '& th': {
                                    backgroundColor: '#FFFFFFB2',
                                },
                                '& td': {
                                    backgroundColor: '#FFFFFFB2',
                                },
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>S. No.</TableCell>
                                    <TableCell>Activity Name</TableCell>
                                    <TableCell>Activity Type</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>View</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {module.activities.map((activity, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>{activity.name}</TableCell>
                                        <TableCell>{activity.type}</TableCell>
                                        <TableCell>
                                            <Button
                                                sx={{
                                                    ...getStatusStyle(
                                                        activity.status
                                                    ),
                                                    textTransform: 'none',
                                                    width: '80%',
                                                    justifyContent: 'center',
                                                    borderRadius: '50px',
                                                    //color: 'white',
                                                }}
                                                disabled={
                                                    activity.status ===
                                                    'Completed'
                                                }
                                            >
                                                {activity.status}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton>
                                                <img
                                                    src={getActivityIcon(
                                                        activity.type
                                                    )}
                                                    alt={activity.type}
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                    }}
                                                />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                sx={{
                                                    color: '#F56D3B',
                                                    textTransform: 'none',
                                                    border: '1px solid #F56D3B',
                                                    borderRadius: '50px',
                                                }}
                                                startIcon={<ReactivateIcon />}
                                                disabled={
                                                    activity.status ===
                                                    'Completed'
                                                }
                                            >
                                                {activity.status === 'Locked'
                                                    ? 'Unlock'
                                                    : 'Reactivate'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                ))}
            </Box>
        </div>
    );
};

export default StudentDetails;
