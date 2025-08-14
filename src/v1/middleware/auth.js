import jwt from 'jsonwebtoken';
export const requireAuth = (req,res,next)=>{
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token) return res.status(401).json({ message:'No token' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ message:'Invalid token' }); }
};
export const sign = (payload, ttl='6h') => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ttl });
