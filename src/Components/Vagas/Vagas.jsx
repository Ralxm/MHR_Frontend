import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Vagas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab } from '@mui/material';
import FileDropZone from '../../Universal/FileDropZone'
import DoughnutPieChart from '../../Universal/DoughnutPieChart';
import { TabContext, TabList, TabPanel } from '@mui/lab';

export default function Vagas(){
    return(
        <div id="root">
            <div className="content" style={{
                background: `url('${process.env.PUBLIC_URL}/Logosvg.svg')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                opacity: 0.4
            }}> </div>
            <NavBar />
            <div className="page-container-despesas">
                <div className="container-fluid">
                    <div className="row">
                        {/* Coluna da esquerda */}
                        

                        {/* Coluna da direita */}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
