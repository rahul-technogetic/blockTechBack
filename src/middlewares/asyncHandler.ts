import { Request, Response, NextFunction } from "express"

export const asyncHandler = (routeHandler: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(
            routeHandler(req, res, next)
        ).catch(next)

    }
}