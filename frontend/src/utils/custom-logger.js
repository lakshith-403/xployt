module.exports = function (source) {
  const directive = '/* LOG: ENABLED */';

  // Check if the directive already exists
  if (!source.includes(directive)) {
    // Prepend the directive
    return `${directive}\n${source}`;
  }

  // Return unchanged source if directive is already present
  return source;
};
