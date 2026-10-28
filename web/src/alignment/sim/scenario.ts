import {
  ending, initialState, loadAlignmentConfig, loadStarts, reduce,
  type AlignmentConfig, type AlignmentState, type Command,
} from '../index'

export type Scenario = readonly Command[]

/** Occurrences always describe the party and day at this point in the replay. */
export function currentCommand(state: AlignmentState, command: Command): Command {
  return command.type === 'event' ? {
    type: 'event', occurrence: {
      defId: command.occurrence.defId,
      witnesses: Object.keys(state.characters).filter((slug) => state.characters[slug].inParty),
      playerActs: true, day: state.day,
    },
  } : command
}

export function run(scenario: Scenario, config: AlignmentConfig = loadAlignmentConfig()) {
  let state = initialState(loadStarts(), config.thresholds, config.gates)
  const log: string[] = []
  for (const command of scenario) {
    const result = reduce(state, currentCommand(state, command), config)
    state = result.state
    log.push(...result.log)
  }
  return { state, ending: ending(state, config), log }
}

/** A planning cursor: every accepted step is executed by the public reducer. */
export class Cursor {
  state: AlignmentState
  route: Command[] = []
  issues: string[] = []
  attempts = 0
  readonly config: AlignmentConfig
  readonly maxSteps: number

  constructor(config: AlignmentConfig, maxSteps: number) {
    checkLimit(maxSteps, 'maxSteps')
    this.config = config
    this.maxSteps = maxSteps
    this.state = initialState(loadStarts(), config.thresholds, config.gates)
  }

  get full() { return this.attempts >= this.maxSteps }

  apply(command: Command): boolean {
    if (this.full) return false
    this.attempts++
    const actual = currentCommand(this.state, command)
    try {
      const result = reduce(this.state, actual, this.config)
      this.state = result.state
      this.route.push(actual)
      return true
    } catch (error) {
      // A rejected command is diagnostic evidence, never part of a replay route.
      const message = error instanceof Error ? error.message : String(error)
      if (!this.issues.includes(message)) this.issues.push(message)
      return false
    }
  }
}

export function checkLimit(value: number, name: string) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`invalid ${name}`)
}

export function eventCommand(defId: string): Command {
  return { type: 'event', occurrence: { defId, witnesses: [], playerActs: true, day: 0 } }
}
