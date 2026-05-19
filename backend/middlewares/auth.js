export const protect = (req, res, next) => {
  req.userId = "user_3DhJ6sjyQ1kidbGtuQL7rs3Ymu4";
  next();
};
//user_3DhJ6sjyQ1kidbGtuQL7rs3Ymu4

// export const protect = async (req, res, next) => {
//   try {
//     const { userId } = await req.auth();
//     if (!userId) {
//       return res.json({ success: false, message: "not authenticated" });
//     }
//     next();
//   } catch (error) {
//     res.json({ success: false, message: error.message });
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

//     //req.userId = userId;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const protect = (req, res, next) => {
//   const { userId } = req.auth();

//   if (!userId) {
//     return res.status(401).json({
//       success: false,
//       message: "not authenticated1",
//     });
//   }

//   req.userId = userId;
//   next();
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
