import React from 'react';
import PropTypes from 'prop-types';

// TEMPORARY scaffold helper — delete this import from a page once you replace
// it with the real UI. Shows which member owns the route and which screenshot(s)
// to reference, so nothing gets built in the wrong place.
export default function PagePlaceholder({ routePath, owner, screenshots = [] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="font-display text-lg font-semibold text-brand-navy">{routePath}</p>
        <p className="mt-2 text-sm text-gray-600">
          Owned by <span className="font-semibold">{owner}</span> — build the real UI here.
        </p>
        {screenshots.length > 0 && (
          <p className="mt-3 text-xs text-gray-400">
            Reference: {screenshots.join(', ')} (in ui-screenshots/)
          </p>
        )}
      </div>
    </div>
  );
}

PagePlaceholder.propTypes = {
  routePath: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  screenshots: PropTypes.arrayOf(PropTypes.string),
};
