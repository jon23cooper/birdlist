function(doc) {
  if (doc.type==="bird") {
    emit(doc._id,null);
  }
};
