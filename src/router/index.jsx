import { createHashRouter } from "react-router-dom";
import FrontNav from "../layout/FrontNav";
import HomePage from "../page/HomePage";
import GamesList from "../page/GamesList";
import GameCart from "../page/GameCart";
import GameDetail from "../page/GameDetail";
import SignIn from "../page/SignIn";
import NotFound from "../page/NotFound";

const Router = createHashRouter(
    [
        {
            path: '/',
            element: <FrontNav />,
            children: [
                {
                    path: '',
                    element: <HomePage />
                },
                {
                    path: 'games',
                    element: <GamesList />
                },
                {
                    path: 'games/:id',
                    element: <GameDetail />
                },
                {
                    path: 'cart',
                    element: <GameCart />
                },
                {
                    path: 'signIn',
                    element: <SignIn />
                }
            ]


        },
        {
            path: '*',
            element: <NotFound />
        }
    ]
);

export default Router;