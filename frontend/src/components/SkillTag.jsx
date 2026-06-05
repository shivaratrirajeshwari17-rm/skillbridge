const SkillTag = ({ skill, type = 'offered', onRemove }) => (
  <span className={`skill-tag ${type === 'offered' ? 'skill-offered' : 'skill-wanted'}`}>
    {skill.skillName || skill}
    {skill.proficiencyLevel && (
      <span style={{ opacity: 0.7, fontSize: 10, marginLeft: 2 }}>({skill.proficiencyLevel[0].toUpperCase()})</span>
    )}
    {onRemove && (
      <span className="remove" onClick={() => onRemove(skill)} title="Remove">✕</span>
    )}
  </span>
);

export default SkillTag;
