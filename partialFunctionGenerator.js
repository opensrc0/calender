const partialApply = (fn, ...fixedArgs) => {
  return function(...remainingArgs) {
    return fn.apply(this, fixedArgs.concat(remainingArgs));
  };
};
