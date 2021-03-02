import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { mainListItems, secondaryListItems } from './ListItems'

import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

// views

import Tables from 'views/admin/Tables.js'
import axiosInstance from '../api/http'
import { toast, ToastContainer } from 'react-toastify'

function Copyright () {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

export default function Admin () {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  const [checklist, setChecklist] = useState([])

  async function getTasks () {
    try {
      const response = await axiosInstance.get('/v1/merchants/123/team-members', {})
      setChecklist(response.data)
    } catch (error) {
      console.error(error)
      toast.error(
        'The username or password you entered is incorrect, please try again.')
    }
  }

  useEffect(() => {

    getTasks()

  }, [])

  const handleAddTask = async (title) => {
    try {
      await axiosInstance.post('/v1/task-create/', {
        title,
      })
      toast.success(
        'Successfully added')
      getTasks()
    } catch (error) {
      console.error(error)
      toast.error(
        'The username or password you entered is incorrect, please try again.')
    }
  }

  const handleUpdateTask = async ({ form }) => {
    try {
      const formData = new FormData()
      formData.append('id', form.id)
      formData.append('completed', form.completed)
      formData.append('title', form.title)
      await axiosInstance.put(`/v1/task-update/${form.id}/`, formData)
      toast.success(
        'Successfully updated')
      getTasks()
    } catch (error) {
      console.error(error)
      toast.error(
        'The username or password you entered is incorrect, please try again.')
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/v1/task-delete/${id}/`)
      toast.success(
        'Successfully deleted')
      getTasks()
    } catch (error) {
      console.error(error)
      toast.error(
        'The username or password you entered is incorrect, please try again.')
    }
  }

  return (
    <>
      <ToastContainer/>
      <Switch>
        <Route path="/list" exact>
          <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="absolute" className={clsx(classes.appBar,
              open && classes.appBarShift)}>
              <Toolbar className={classes.toolbar}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  className={clsx(classes.menuButton,
                    open && classes.menuButtonHidden)}
                >
                  <MenuIcon/>
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap
                            className={classes.title}>
                  Dashboard
                </Typography>
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon/>
                  </Badge>
                </IconButton>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              classes={{
                paper: clsx(classes.drawerPaper,
                  !open && classes.drawerPaperClose),
              }}
              open={open}
            >
              <div className={classes.toolbarIcon}>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon/>
                </IconButton>
              </div>
              <Divider/>
              <List>{mainListItems}</List>
              <Divider/>
              <List>{secondaryListItems}</List>
            </Drawer>
            <main className={classes.content}>
              <div className={classes.appBarSpacer}/>
              <Container maxWidth="lg" className={classes.container}>
                <Tables checklist={checklist} onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}/>
                <Box pt={4}>
                  <Copyright/>
                </Box>
              </Container>
            </main>
          </div>
        </Route>
        <Redirect from="/" to="/list"/>
      </Switch>
    </>
  )
}
