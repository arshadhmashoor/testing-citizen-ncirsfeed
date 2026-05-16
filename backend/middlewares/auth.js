import { getAuth } from "@clerk/express";

export const protect = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "not authenticated",
    });
  }

  req.userId = userId;
  next();
};

// export const protect = (req, res, next) => {
//   try {
//     const auth = req.auth();
//     console.log("CLERK AUTH:", auth);

//     const { userId } = auth;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "not authenticated",
//       });
//     }

//     next();
//   } catch (error) {
//     console.log("AUTH ERROR:", error);

//     return res.status(401).json({
//       success: false,
//       message: "not authenticated",
//     });
//   }
// };

// export const protect = async (req, res, next) => {
//   try {
//     const { userId } = await req.auth();
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "not authenticated",
//       });
//     }
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "not authenticated",
//     });
//   }
// };
