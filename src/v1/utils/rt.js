export const emitProject = (projectId, event, payload) => {
  if(global.io) global.io.to('project:'+projectId).emit(event, payload);
};
