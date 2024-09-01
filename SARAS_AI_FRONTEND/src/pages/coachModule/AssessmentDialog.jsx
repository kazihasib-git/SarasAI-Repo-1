import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

const AssessmentDialog = ({ open, onClose, assessmentData }) => {
    const assessments = Array.isArray(assessmentData) ? assessmentData : [];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    marginTop: '12px',
                }}
            >
                <h4
                    style={{
                        marginTop: 20,
                        color: '#1A1E3D',
                        fontWeight: '600',
                    }}
                >
                    View Assessment
                </h4>
                <CloseIcon
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 6,
                        color: '#F56D3B',
                        cursor: 'pointer',
                        '&:hover': {
                            color: '#F56D3B',
                        },
                    }}
                />
            </DialogTitle>
            <DialogContent>
                {assessments.length > 0 ? (
                    <div>
                        {assessments.map((assessment, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <strong>{assessment.name}</strong>
                                        {assessment.status ===
                                        'Not Attempted' ? (
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: '700',
                                                    color: '#FF0000',
                                                    borderRadius: '50px',
                                                    borderColor: '#FF0000',
                                                    backgroundColor: 'none',
                                                    '&:hover': {
                                                        borderColor: '#FF0000',
                                                    },
                                                }}
                                            >
                                                Not Attempted
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: '700',
                                                    color: '#F56D3B',
                                                    borderRadius: '50px',
                                                    borderColor: '#F56D3B',
                                                    backgroundColor: 'none',
                                                    '&:hover': {
                                                        borderColor: '#F56D3B',
                                                    },
                                                }}
                                            >
                                                View Report
                                            </Button>
                                        )}
                                    </div>
                                    <h6
                                        style={{
                                            margin: '5px 0',
                                            color: '#5F6383',
                                            fontWeight: '400',
                                        }}
                                    >
                                        {assessment.source}
                                    </h6>
                                </div>
                                <Divider
                                    sx={{
                                        borderColor: '#828282',
                                        borderWidth: '1px',
                                        margin: '10px 0',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No assessments available</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

// Define prop types and default props
// AssessmentDialog.propTypes = {
//     open: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
//     assessmentData: PropTypes.array.isRequired,
// };

// AssessmentDialog.defaultProps = {
//     assessmentData: [],
// };

export default AssessmentDialog;
