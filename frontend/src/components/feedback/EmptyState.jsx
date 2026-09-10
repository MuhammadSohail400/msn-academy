import React from 'react';
import PropTypes from 'prop-types';
import { Inbox } from 'lucide-react';
import Button from '../ui/Button';

// Generic empty state card with icon & CTA — e.g. "No courses in your cart yet"
export default function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center">
      <Icon className="mb-3 h-10 w-10 text-gray-300" />
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};
