import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './page/sign-in.tsx'
import Home from './page/home.tsx'
import CreateEvent from './page/createEvent.tsx'
import CreateLabs from './page/createLabs.tsx'
import CreateSummary from './page/createSummary.tsx'
import EventInfo from './page/eventInfo.tsx'
import Tracks from './page/tracks.tsx'
import CreateTrack from './page/createTrack.tsx'
import User from './page/user.tsx'
import AuthProvider from './providers/AuthProvider.tsx'
import QueryProvider from './providers/QueryProvider.tsx'
import FormProvider from './providers/FormProvider.tsx'
import ProtectedRoot from './providers/ProtectedRoot.tsx'
//import { Test } from './page/test.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/user',
    element: <User />
  },
  {
    element: <ProtectedRoot userType='Admin' />,
    children: [
      {
        path: '/create',
        element: <CreateEvent />
      },
      {
        path: '/create-labs',
        element: <CreateLabs />
      },
      {
        path: '/create-summary',
        element: <CreateSummary />
      },
      {
        path: '/event/:eventID',
        element: <EventInfo />
      }
    ]
  },
  {
    element: <ProtectedRoot userType={'RSW'} />,
    children: [
      {
        path: '/tracks/:eventID',
        element: <Tracks />,
      },
      {
        path: '/create-track/:eventID',
        element: <CreateTrack />
      },
      {
        path: '/create-track/:eventID/edit/:trackID',
        element: <CreateTrack />
      }
    ]
  }
],
  {
    basename: "/Event-Planner"
  }
)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <AuthProvider>
        <QueryProvider>
          <FormProvider>
            <RouterProvider router={router} />
          </FormProvider>
        </QueryProvider>
      </AuthProvider>
  </React.StrictMode>
)
